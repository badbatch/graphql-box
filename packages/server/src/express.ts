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

  private async _handleBatchRequests(
    res: Response,
    requests: BatchRequestData['operations'],
    options: OperationOptions,
  ) {
    const response: SerialisedResponseDataBatch = { responses: {} };

    await Promise.all(
      Object.keys(requests).map(async requestId => {
        const requestEntry = requests[requestId];

        if (!requestEntry) {
          return;
        }

        const { context, operation } = requestEntry;

        if (
          this._operationWhitelist.length > 0 &&
          context.data.originalOperationHash &&
          !this._operationWhitelist.includes(context.data.originalOperationHash)
        ) {
          response.responses[requestId] = serializeErrors({
            errors: [new Error('@graphql-box/server: The request is not whitelisted.')],
          });

          return;
        }

        try {
          const requestTimer = setTimeout(() => {
            response.responses[requestId] = serializeErrors({
              errors: [
                new Error(`@graphql-box/server did not process the request within ${String(this._requestTimeout)}ms.`),
              ],
              requestID: context.data.requestID,
            });
          }, this._requestTimeout);

          // The client already has scope of this so no need to send it back.
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { operationId, ...otherProps } = await this._client.query(operation, options, context);
          clearTimeout(requestTimer);
          const responseEntry = serializeErrors({ ...otherProps });
          response.responses[requestId] = responseEntry;
        } catch (error) {
          const confirmedError = isError(error)
            ? error
            : new Error('@graphql-box/server handleBatchRequest had an unexpected error.');

          response.responses[requestId] = serializeErrors({
            errors: [confirmedError],
          });
        }
      }),
    );

    res.status(200).send(response);
  }

  private _handleLogs(logs: Omit<LogDataPayload, 'batched'>[]) {
    for (const { data, logLevel, message } of logs) {
      this._client.debugManager?.handleLog(message, data, logLevel);
    }
  }

  private async _handleRequest(
    res: Response,
    operation: string,
    options: OperationOptions,
    context: { data: OperationContextData },
  ) {
    if (this._operationWhitelist.length > 0 && !this._operationWhitelist.includes(context.data.originalOperationHash)) {
      res.status(400).send(serializeErrors({ errors: [new Error('The request is not whitelisted.')] }));
      return;
    }

    const requestTimer = setTimeout(() => {
      res.status(408).send(
        serializeErrors({
          errors: [
            new Error(`@graphql-box/server did not process the request within ${String(this._requestTimeout)}ms.`),
          ],
        }),
      );
    }, this._requestTimeout);

    const result = await this._client.query(operation, options, context);
    clearTimeout(requestTimer);
    // The client already has scope of this so no need to send it back.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { operationId, ...otherProps } = result;
    const responseData = serializeErrors({ ...otherProps });
    res.status(200).send(responseData);
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
        void this._handleBatchRequests(res, operations, options);
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
