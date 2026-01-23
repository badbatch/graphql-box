import { type Client } from '@graphql-box/client';
import { type OperationContextData, type OperationOptions } from '@graphql-box/core';
import { ArgsError, GroupedError, serializeErrors } from '@graphql-box/helpers';
import { type Request, type Response } from 'express';
import { isError, isPlainObject } from 'lodash-es';
import { isLogBatched } from './helpers/isLogBatched.ts';
import { isRequestBatched } from './helpers/isRequestBatched.ts';
import {
  type BatchRequestData,
  type BatchedLogDataPayload,
  type ExpressRequestHandler,
  type LogDataPayload,
  type RequestData,
  type SerialisedResponseDataBatch,
  type UserOptions,
} from './types.ts';

export class ExpressMiddleware {
  private _client: Client;
  private readonly _operationWhitelist: string[];
  private readonly _requestTimeout: number;

  constructor(options: UserOptions) {
    const errors: ArgsError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new ArgsError('@graphql-box/server expected options to ba a plain object.'));
    }

    if (!('client' in options)) {
      errors.push(new ArgsError('@graphql-box/server expected options.client.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@graphql-box/server argument validation errors.', errors);
    }

    this._client = options.client;
    this._requestTimeout = options.requestTimeout ?? 10_000;
    this._operationWhitelist = options.operationWhitelist ?? [];
  }

  public createLogHandler(): ExpressRequestHandler {
    return (req: Request<unknown, unknown, LogDataPayload | BatchedLogDataPayload>, res: Response) => {
      this._logHandler(req, res);
    };
  }

  public createRequestHandler(options: OperationOptions = {}): ExpressRequestHandler {
    return (req: Request<unknown, unknown, RequestData | BatchRequestData>, res: Response) => {
      this._requestHandler(req, res, options);
    };
  }

  private async _handleBatchRequest(
    res: Response,
    requests: BatchRequestData['operations'],
    options: OperationOptions,
  ) {
    const response: SerialisedResponseDataBatch = { responses: {} };

    await Promise.all(
      Object.keys(requests).map(async operationId => {
        const requestEntry = requests[operationId];

        if (!requestEntry) {
          return;
        }

        const { context, operation } = requestEntry;
        const { rawOperationHash } = context.data;

        if (
          this._operationWhitelist.length > 0 &&
          rawOperationHash &&
          !this._operationWhitelist.includes(rawOperationHash)
        ) {
          response.responses[operationId] = serializeErrors({
            errors: [new Error('@graphql-box/server: The request is not whitelisted')],
            extensions: { cacheMetadata: {} },
          });

          return;
        }

        let requestFinished = false;

        const requestTimer = setTimeout(() => {
          if (requestFinished) {
            return;
          }

          requestFinished = true;

          response.responses[operationId] = serializeErrors({
            errors: [
              new Error(`@graphql-box/server did not process the request within ${String(this._requestTimeout)}ms.`),
            ],
            extensions: { cacheMetadata: {} },
          });
        }, this._requestTimeout);

        try {
          // The client already has scope of this so no need to send it back.
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { operationId: unusedOperationId, ...otherProps } = await this._client.query(
            operation,
            options,
            context,
          );

          // typescript not deriving that requestFinished can be true
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (requestFinished) {
            return;
          }

          response.responses[operationId] = serializeErrors({ ...otherProps });
        } catch (error) {
          // typescript not deriving that requestFinished can be true
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (requestFinished) {
            return;
          }

          const confirmedError = isError(error)
            ? error
            : new Error('@graphql-box/server handleBatchRequest had an unexpected error.');

          response.responses[operationId] = serializeErrors({
            errors: [confirmedError],
            extensions: { cacheMetadata: {} },
          });
        } finally {
          requestFinished = true;
          clearTimeout(requestTimer);
        }
      }),
    );

    res.status(200).send(response);
  }

  private _handleLogs(logs: Omit<LogDataPayload, 'batched'>[]) {
    for (const { data, logLevel, message } of logs) {
      this._client.debugManager?.log(message, data, logLevel, true);
    }
  }

  private async _handleRequest(
    res: Response,
    operation: string,
    options: OperationOptions,
    context: { data: OperationContextData },
  ) {
    if (this._operationWhitelist.length > 0 && !this._operationWhitelist.includes(context.data.rawOperationHash)) {
      res.status(403).send(serializeErrors({ errors: [new Error('The request is not whitelisted.')] }));
      return;
    }

    let requestFinished = false;

    const requestTimer = setTimeout(() => {
      if (requestFinished) {
        return;
      }

      requestFinished = true;

      res.status(408).send(
        serializeErrors({
          errors: [
            new Error(`@graphql-box/server did not process the request within ${String(this._requestTimeout)}ms.`),
          ],
        }),
      );
    }, this._requestTimeout);

    try {
      const result = await this._client.query(operation, options, context);

      // typescript not deriving that requestFinished can be true
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (requestFinished) {
        return;
      }

      // The client already has scope of this so no need to send it back.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { operationId, ...otherProps } = result;
      const responseData = serializeErrors({ ...otherProps });
      res.status(200).send(responseData);
    } catch (error) {
      // typescript not deriving that requestFinished can be true
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (requestFinished) {
        return;
      }

      const confirmedError = isError(error)
        ? error
        : new Error('@graphql-box/server handleRequest had an unexpected error.');

      res.status(200).send(
        serializeErrors({
          errors: [confirmedError],
          extensions: { cacheMetadata: {} },
        }),
      );
    } finally {
      requestFinished = true;
      clearTimeout(requestTimer);
    }
  }

  private _logHandler(req: Request<unknown, unknown, LogDataPayload | BatchedLogDataPayload>, res: Response) {
    try {
      let logs: Omit<LogDataPayload, 'batched'>[] = [];
      const { body } = req;

      if (isLogBatched(body)) {
        logs = Object.values(body.requests);
      } else {
        // We don't care about the batched flag after this point.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { batched, ...rest } = body;
        logs = [rest];
      }

      this._handleLogs(logs);
      res.status(204).send();
    } catch (error) {
      const confirmedError = isError(error)
        ? error
        : new Error('@graphql-box/server logHandler had an unexpected error.');

      res.status(500).send(serializeErrors({ errors: [confirmedError] }));
    }
  }

  private _requestHandler(
    { body }: Request<unknown, unknown, RequestData | BatchRequestData>,
    res: Response,
    options: OperationOptions,
  ) {
    try {
      if (isRequestBatched(body)) {
        const { operations } = body;
        void this._handleBatchRequest(res, operations, options);
      } else {
        const { context, operation } = body;
        void this._handleRequest(res, operation, options, context);
      }
    } catch (error) {
      const confirmedError = isError(error)
        ? error
        : new Error('@graphql-box/server requestHandler had an unexpected error.');

      res.status(500).send(serializeErrors({ errors: [confirmedError] }));
    }
  }
}
