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
  private readonly _client: Client;
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
    if (this._operationWhitelist.length > 0 && !this._operationWhitelist.includes(context.data.rawOperationHash)) {
      return new NextResponse(
        JSON.stringify(serializeErrors({ errors: [new Error('@graphql-box/server the request is not whitelisted.')] })),
        {
          status: 403,
        },
      );
    }

    return new Promise<NextResponse>(resolve => {
      let requestFinished = false;

      void (async () => {
        const requestTimer = setTimeout(() => {
          if (requestFinished) {
            return;
          }

          requestFinished = true;
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

        try {
          const result = await this._client.query(operation, options, context);

          // typescript not deriving that requestFinished can be true
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (requestFinished) {
            return;
          }

          // We don't want to send the operationId back as the client already
          // has scope of this.
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { operationId, ...otherProps } = result;
          const responseData = serializeErrors({ ...otherProps });

          resolve(
            NextResponse.json(responseData, {
              status: 200,
            }),
          );
        } catch (error) {
          // typescript not deriving that requestFinished can be true
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (requestFinished) {
            return;
          }

          const confirmedError = isError(error)
            ? error
            : new Error('@graphql-box/server handleRequest had an unexpected error.');

          resolve(
            NextResponse.json(
              serializeErrors({
                errors: [confirmedError],
                extensions: { cacheMetadata: {} },
              }),
              {
                status: 200,
              },
            ),
          );
        } finally {
          requestFinished = true;
          clearTimeout(requestTimer);
        }
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
