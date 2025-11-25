import { type Client } from '@graphql-box/client';
import { type OperationContextData, type OperationOptions } from '@graphql-box/core';
import { ArgsError, GroupedError, serializeErrors } from '@graphql-box/helpers';
import { isError, isPlainObject } from 'lodash-es';
import { type NextRequest, NextResponse } from 'next/server.js';
import { nextEnrichContextValue } from '#helpers/nextEnrichContextValue.ts';
import { isLogBatched } from './helpers/isLogBatched.ts';
import { isRequestBatched } from './helpers/isRequestBatched.ts';
import {
  type BatchRequestData,
  type BatchedLogDataPayload,
  type LogDataPayload,
  type NextRequestHandler,
  type RequestData,
  type SerialisedResponseDataBatch,
  type UserOptions,
} from './types.ts';

export class NextMiddleware {
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

  public createLogHandler(): NextRequestHandler {
    return (req: NextRequest) => this._logHandler(req);
  }

  public createRequestHandler(options: OperationOptions = {}): NextRequestHandler {
    return (req: NextRequest) => this._requestHandler(req, nextEnrichContextValue(req, options));
  }

  private async _handleBatchRequest(requests: BatchRequestData['operations'], options: OperationOptions) {
    const response: SerialisedResponseDataBatch = { responses: {} };

    await Promise.all(
      Object.keys(requests).map(async requestId => {
        const requestEntry = requests[requestId];

        if (!requestEntry) {
          return;
        }

        const { context, operation } = requestEntry;
        const { originalOperationHash } = context.data;

        if (
          this._operationWhitelist.length > 0 &&
          originalOperationHash &&
          !this._operationWhitelist.includes(originalOperationHash)
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

    return NextResponse.json(response, {
      status: 200,
    });
  }

  private _handleLogs(logs: Omit<LogDataPayload, 'batched'>[]) {
    for (const { data, logLevel, message } of logs) {
      this._client.debugManager?.handleLog(message, data, logLevel);
    }
  }

  private async _handleRequest(operation: string, options: OperationOptions, context: { data: OperationContextData }) {
    if (this._operationWhitelist.length > 0 && !this._operationWhitelist.includes(context.data.originalOperationHash)) {
      return new NextResponse(
        JSON.stringify(serializeErrors({ errors: [new Error('The request is not whitelisted.')] })),
        {
          status: 400,
        },
      );
    }

    return new Promise<NextResponse>(resolve => {
      void (async () => {
        const requestTimer = setTimeout(() => {
          const message = `@graphql-box/server did not process the request within ${String(this._requestTimeout)}ms.`;

          resolve(
            new NextResponse(
              JSON.stringify(
                serializeErrors({
                  errors: [new Error(message)],
                }),
              ),
              {
                status: 408,
              },
            ),
          );
        }, this._requestTimeout);

        const result = await this._client.query(operation, options, context);
        clearTimeout(requestTimer);
        // The client already has scope of this so no need to send it back.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { operationId, ...otherProps } = result;
        const responseData = serializeErrors({ ...otherProps });

        resolve(
          NextResponse.json(responseData, {
            status: 200,
          }),
        );
      })();
    });
  }

  private async _logHandler(req: NextRequest) {
    try {
      let logs: Omit<LogDataPayload, 'batched'>[] = [];
      // res.json returns an any type
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const body = (await req.json()) as LogDataPayload | BatchedLogDataPayload;

      if (isLogBatched(body)) {
        logs = Object.values(body.requests);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { batched, ...rest } = body;
        logs = [rest];
      }

      this._handleLogs(logs);

      return new NextResponse(undefined, {
        status: 204,
      });
    } catch (error) {
      const confirmedError = isError(error)
        ? error
        : new Error('@graphql-box/server logHandler had an unexpected error.');

      return NextResponse.json(serializeErrors({ errors: [confirmedError] }), {
        status: 500,
      });
    }
  }

  private async _requestHandler(req: NextRequest, options: OperationOptions): Promise<NextResponse> {
    try {
      // res.json returns an any type
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const body = (await req.json()) as RequestData | BatchRequestData;

      if (isRequestBatched(body)) {
        const { operations } = body;
        return await this._handleBatchRequest(operations, options);
      } else {
        const { context, operation } = body;
        return await this._handleRequest(operation, options, context);
      }
    } catch (error) {
      const confirmedError = isError(error)
        ? error
        : new Error('@graphql-box/server requestHandler had an unexpected error.');

      return NextResponse.json(serializeErrors({ errors: [confirmedError] }), {
        status: 500,
      });
    }
  }
}
