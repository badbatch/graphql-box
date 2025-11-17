import { type CoreWorker } from '@cachemap/core-worker';
import { type CacheManagerDef } from '@graphql-box/cache-manager';
import {
  type DebugManagerDef,
  type OperationContext,
  type OperationData,
  type OperationOptions,
  type PartialOperationContext,
  type PlainObject,
  type ResponseData,
  type ResponseDataWithoutErrors,
} from '@graphql-box/core';
import { OPERATION_RESOLVED } from '@graphql-box/core';
import { ArgsError, GroupedError, deserializeErrors, hashOperation, isPlainObject } from '@graphql-box/helpers';
import { type OperationParserDef } from '@graphql-box/operation-parser';
import { OperationTypeNode } from 'graphql';
import { v4 as uuid } from 'uuid';
import { GRAPHQL_BOX, MESSAGE } from './constants.ts';
import { logOperation } from './debug/logOperation.ts';
import {
  type MessageRequestPayload,
  type MessageResponsePayload,
  type PendingResolver,
  type PendingTracker,
  type UserOptions,
} from './types.ts';

export class WorkerClient {
  private static _resolve({ __cacheMetadata, ...rest }: ResponseData, options: OperationOptions): ResponseData {
    const result: ResponseData = { ...rest };

    if (options.returnCacheMetadata && __cacheMetadata) {
      result.__cacheMetadata = __cacheMetadata;
    }

    return result;
  }

  private _onMessage = ({ data }: MessageEvent<MessageResponsePayload>): void => {
    if (!isPlainObject(data)) {
      return;
    }

    const { context, result, type } = data;

    if (type !== GRAPHQL_BOX) {
      return;
    }

    const { operationId, operationType } = context.data;
    const pending = this._pending.get(operationId);

    if (!pending) {
      return;
    }

    this._debugManager?.log(OPERATION_RESOLVED, {
      data: context.data,
      stats: { endTime: this._debugManager.now() },
    });

    const response: ResponseData = { ...deserializeErrors(result) };

    if (operationType === OperationTypeNode.QUERY && pending.operationData && pending.options && pending.context) {
      void this._cacheManager.cacheQuery(response, pending.context);
    }

    pending.resolve(response);
  };

  /**
   * This cache instance does not actually store anything itself,
   * it is for communicating with the worker cache that the worker
   * client is using within the worker.
   */
  private readonly _cache: CoreWorker;
  private readonly _cacheManager: CacheManagerDef;
  private readonly _debugManager: DebugManagerDef | undefined;
  private _messageQueue: MessageRequestPayload[] = [];
  private _operationParser: OperationParserDef;
  private _pending: PendingTracker = new Map();
  private _worker: Worker | undefined;

  constructor(options: UserOptions) {
    const errors: ArgsError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new ArgsError('@graphql-box/worker-client expected options to ba a plain object.'));
    }

    if (!('cache' in options)) {
      errors.push(new ArgsError('@graphql-box/worker-client expected options.cache.'));
    }

    if (!('cacheManager' in options)) {
      errors.push(new ArgsError('@graphql-box/worker-client expected options.cacheManager.'));
    }

    if (!('operationParser' in options)) {
      errors.push(new ArgsError('@graphql-box/worker-client expected options.requestParser.'));
    }

    if (!options.lazyWorkerInit && !('worker' in options)) {
      errors.push(new ArgsError('@graphql-box/worker-client expected options.worker.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@graphql-box/worker-client argument validation errors.', errors);
    }

    this._cache = options.cache;
    this._cacheManager = options.cacheManager;
    this._debugManager = options.debugManager;
    this._operationParser = options.operationParser;

    if (typeof options.worker === 'function') {
      Promise.resolve(options.worker())
        .then(worker => {
          this._worker = worker;
          this._addEventListener();
          this._releaseMessageQueue();
        })
        .catch((error: unknown) => {
          throw error;
        });
    } else if (options.worker) {
      this._worker = options.worker;
      this._addEventListener();
    }
  }

  get cache(): CoreWorker {
    return this._cache;
  }

  get cacheManager(): CacheManagerDef {
    return this._cacheManager;
  }

  public async query<T extends PlainObject = PlainObject>(
    operation: string,
    options: OperationOptions = {},
    context: PartialOperationContext = {},
  ): Promise<ResponseData> {
    const operationContext = this._getOperationContext(OperationTypeNode.QUERY, operation, options, context);
    const operationData = this._operationParser.buildOperationData(operation, options, operationContext);
    // Casting to allow user to type response data while allowing downstream code
    // to be more generic.
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this._handleQuery(operationData, options, operationContext) as Promise<ResponseData<T>>;
  }

  public set worker(worker: Worker) {
    this._worker = worker;
    this._addEventListener();
    this._releaseMessageQueue();
  }

  private _addEventListener(): void {
    if (!this._worker) {
      throw new Error('A worker is required for the WorkerClient to work correctly.');
    }

    this._worker.addEventListener(MESSAGE, this._onMessage);
  }

  private _getOperationContext(
    operationType: OperationTypeNode,
    operation: string,
    options: OperationOptions,
    context: PartialOperationContext,
  ): OperationContext {
    return {
      ...context,
      data: {
        ...context.data,
        batched: options.batch,
        operationId: uuid(),
        operationMaxFieldDepth: undefined,
        operationName: '',
        operationType,
        operationTypeComplexity: undefined,
        originalOperationHash: hashOperation(operation),
        tag: options.tag,
        variables: options.variables,
      },
      debugManager: this._debugManager,
      fieldPaths: undefined,
    };
  }

  @logOperation()
  private async _handleQuery(
    operationData: OperationData,
    options: OperationOptions,
    context: OperationContext,
  ): Promise<ResponseData> {
    const result = await this._cacheManager.cache?.get<ResponseDataWithoutErrors>(operationData.operation, {
      hashKey: this._cacheManager.hashCacheKeys,
    });

    if (result) {
      return WorkerClient._resolve(result, options);
    }

    return await new Promise((resolve: PendingResolver) => {
      if (this._worker) {
        this._worker.postMessage({
          context: {
            data: context.data,
          },
          operation: operationData.operation,
          options,
          type: GRAPHQL_BOX,
        });
      } else {
        this._messageQueue.push({
          context: {
            data: context.data,
          },
          operation: operationData.operation,
          options,
          type: GRAPHQL_BOX,
        });
      }

      this._pending.set(context.data.operationId, { context, operationData, options, resolve });
    });
  }

  private _releaseMessageQueue(): void {
    if (!this._worker) {
      throw new Error('A worker is required for the WorkerClient to work correctly.');
    }

    const messageQueue = [...this._messageQueue];
    this._messageQueue = [];

    for (const message of messageQueue) {
      this._worker.postMessage(message);
    }
  }
}
