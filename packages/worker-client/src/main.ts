import { type CoreWorker } from '@cachemap/core-worker';
import {
  type DebugManagerDef,
  OPERATION_REJECTED,
  type OperationContext,
  type OperationOptions,
  type PartialOperationContext,
  type PlainObject,
  type QueryResult,
  type ResponseData,
} from '@graphql-box/core';
import { OPERATION_RESOLVED } from '@graphql-box/core';
import {
  ArgsError,
  InternalError,
  NetworkError,
  QueryError,
  deserializeErrors,
  hashOperation,
  isPlainObject,
} from '@graphql-box/helpers';
import { OperationTypeNode } from 'graphql';
import { isError } from 'lodash-es';
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
  private _onMessage = ({ data }: MessageEvent<MessageResponsePayload>): void => {
    if (!isPlainObject(data)) {
      return;
    }

    const { context, result, type } = data;

    if (type !== GRAPHQL_BOX) {
      return;
    }

    const { operationId } = context.data;
    const pending = this._pending.get(operationId);

    if (!pending) {
      return;
    }

    if (!result.data || Object.keys(result.data).length === 0) {
      this._debugManager?.log(OPERATION_REJECTED, {
        data: context.data,
        stats: { endTime: this._debugManager.now() },
      });
    } else {
      this._debugManager?.log(OPERATION_RESOLVED, {
        data: context.data,
        stats: { endTime: this._debugManager.now() },
      });
    }

    pending.resolve(deserializeErrors(result));
    this._pending.delete(operationId);
  };

  /**
   * This cache instance does not actually store anything itself,
   * it is for communicating with the worker cache that the worker
   * client is using within the worker.
   */
  private readonly _cache: CoreWorker;
  private readonly _debugManager: DebugManagerDef | undefined;
  private _messageQueue: MessageRequestPayload[] = [];
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

    if (!options.lazyWorkerInit && !('worker' in options)) {
      errors.push(new ArgsError('@graphql-box/worker-client expected options.worker.'));
    }

    if (errors.length > 0) {
      throw new AggregateError(errors, '@graphql-box/worker-client argument validation errors.');
    }

    this._cache = options.cache;
    this._debugManager = options.debugManager;

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

  public async query<T extends PlainObject = PlainObject>(
    operation: string,
    options: OperationOptions = {},
    context: PartialOperationContext = {},
  ): Promise<QueryResult<T>> {
    const operationContext = this._buildOperationContext(OperationTypeNode.QUERY, operation, options, context);
    const { data, errors = [], extensions } = await this._handleQuery(operation, options, operationContext);

    const internalOrNetworkErrors = errors.filter(
      error => error instanceof NetworkError || error instanceof InternalError,
    );

    if (internalOrNetworkErrors.length > 0) {
      throw new AggregateError(internalOrNetworkErrors, 'The query had runtime errors');
    }

    if (!data) {
      throw new QueryError('The query did not return any data', errors, extensions, operationContext.data.operationId);
    }

    // Casting to allow user to type response data while allowing downstream code
    // to be more generic.
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return { data, errors, extensions, operationId: operationContext.data.operationId } as QueryResult<T>;
  }

  public set worker(worker: Worker) {
    this._worker = worker;
    this._addEventListener();
    this._releaseMessageQueue();
  }

  private _addEventListener(): void {
    if (!this._worker) {
      throw new InternalError('A worker is required for the WorkerClient to work correctly.');
    }

    this._worker.addEventListener(MESSAGE, this._onMessage);

    const clearPending = (err: unknown) => {
      for (const { reject } of this._pending.values()) {
        const error = isError(err) ? err : new InternalError('Worker errored, pending operations have been rejected');
        reject(error);
      }

      this._pending.clear();
    };

    this._worker.addEventListener('error', clearPending);
    this._worker.addEventListener('messageerror', clearPending);
  }

  private _buildOperationContext(
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
        rawOperationHash: hashOperation(operation),
        tag: options.tag,
        variables: options.variables,
      },
      debugManager: this._debugManager,
      fieldPaths: {},
      idKey: '',
    };
  }

  @logOperation()
  private async _handleQuery(
    operation: string,
    options: OperationOptions,
    context: OperationContext,
  ): Promise<ResponseData> {
    return await new Promise((resolve: PendingResolver, reject) => {
      if (this._worker) {
        this._worker.postMessage({
          context: {
            data: context.data,
          },
          operation,
          options,
          type: GRAPHQL_BOX,
        });
      } else {
        this._messageQueue.push({
          context: {
            data: context.data,
          },
          operation,
          options,
          type: GRAPHQL_BOX,
        });
      }

      this._pending.set(context.data.operationId, { context, operation, options, reject, resolve });
    });
  }

  private _releaseMessageQueue(): void {
    if (!this._worker) {
      throw new InternalError('A worker is required for the WorkerClient to work correctly.');
    }

    const messageQueue = [...this._messageQueue];
    this._messageQueue = [];

    for (const message of messageQueue) {
      this._worker.postMessage(message);
    }
  }
}
