import { type Client } from '@graphql-box/client';
import {
  type PartialDehydratedRequestResult,
  type PartialRawFetchData,
  type PartialRequestContext,
  type PartialRequestResult,
  SERVER_REQUEST_RECEIVED,
  type ServerRequestOptions,
} from '@graphql-box/core';
import { ArgsError, GroupedError, dehydrateCacheMetadata, serializeErrors } from '@graphql-box/helpers';
import { isAsyncIterable } from 'iterall';
import { isError, isPlainObject } from 'lodash-es';
import { type NextRequest, NextResponse } from 'next/server.js';
import { asyncIteratorToStream } from './helpers/asyncIteratorToStream.ts';
import { isLogBatched } from './helpers/isLogBatched.ts';
import { isRequestBatched } from './helpers/isRequestBatched.ts';
import {
  type BatchRequestData,
  type BatchedLogData,
  type LogData,
  type NextRequestHandler,
  type RequestData,
  type ResponseDataWithMaybeDehydratedCacheMetadataBatch,
  type UserOptions,
} from './types.ts';

export class NextMiddleware {
  private _client: Client;
  private _requestTimeout: number;
  private _requestWhitelist: string[];

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
    this._requestWhitelist = options.requestWhitelist ?? [];
  }

  public createLogHandler(): NextRequestHandler {
    return (req: NextRequest) => this._logHandler(req);
  }

  public createRequestHandler(options: ServerRequestOptions = {}): NextRequestHandler {
    return (req: NextRequest) => this._requestHandler(req, options);
  }

  private async _handleBatchRequest(requests: BatchRequestData['requests'], options: ServerRequestOptions) {
    const response: ResponseDataWithMaybeDehydratedCacheMetadataBatch = { responses: {} };

    await Promise.all(
      Object.keys(requests).map(async requestHash => {
        const requestEntry = requests[requestHash];

        if (!requestEntry) {
          return;
        }

        const { context, request } = requestEntry;

        if (
          this._requestWhitelist.length > 0 &&
          context.originalRequestHash &&
          !this._requestWhitelist.includes(context.originalRequestHash)
        ) {
          response.responses[requestHash] = serializeErrors({
            errors: [new Error('@graphql-box/server: The request is not whitelisted.')],
            requestID: context.requestID,
          });

          return;
        }

        try {
          const requestTimer = setTimeout(() => {
            response.responses[requestHash] = serializeErrors({
              errors: [new Error(`@graphql-box/server did not process the request within ${this._requestTimeout}ms.`)],
              requestID: context.requestID,
            });
          }, this._requestTimeout);

          const { _cacheMetadata, ...otherProps } = (await this._client.request(
            request,
            options,
            context
          )) as PartialRequestResult;

          clearTimeout(requestTimer);
          const responseEntry = serializeErrors({ ...otherProps }) as PartialRawFetchData;

          if (_cacheMetadata) {
            responseEntry._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
          }

          response.responses[requestHash] = responseEntry;
        } catch (error) {
          const confirmedError = isError(error)
            ? error
            : new Error('@graphql-box/server handleBatchRequest had an unexpected error.');

          response.responses[requestHash] = serializeErrors({
            errors: [confirmedError],
            requestID: context.requestID,
          });
        }
      })
    );

    return new NextResponse(JSON.stringify(response), {
      status: 200,
    });
  }

  private _handleLogs(logs: Omit<LogData, 'batched'>[]) {
    for (const { data, logLevel, message } of logs) {
      this._client.debugger?.handleLog(message, data, logLevel);
    }
  }

  private async _handleRequest(request: string, options: ServerRequestOptions, context: PartialRequestContext) {
    if (this._requestWhitelist.length > 0 && !this._requestWhitelist.includes(context.originalRequestHash!)) {
      return new NextResponse(
        JSON.stringify(serializeErrors({ errors: [new Error('The request is not whitelisted.')] })),
        {
          status: 400,
        }
      );
    }

    return new Promise<NextResponse>(resolve => {
      void (async () => {
        const requestTimer = setTimeout(() => {
          resolve(
            new NextResponse(
              JSON.stringify(
                serializeErrors({
                  errors: [
                    new Error(`@graphql-box/server did not process the request within ${this._requestTimeout}ms.`),
                  ],
                })
              ),
              {
                status: 408,
              }
            )
          );
        }, this._requestTimeout);

        const requestResult = await this._client.request(request, options, context);
        clearTimeout(requestTimer);

        if (!isAsyncIterable(requestResult)) {
          const { _cacheMetadata, ...otherProps } = requestResult as PartialRequestResult;
          const response: PartialDehydratedRequestResult = serializeErrors({ ...otherProps });

          if (_cacheMetadata) {
            response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
          }

          resolve(
            new NextResponse(JSON.stringify(response), {
              status: 200,
            })
          );

          return;
        }

        const asyncInteratorResult = requestResult as AsyncIterator<
          PartialRequestResult | undefined,
          PartialRequestResult | undefined
        >;

        resolve(
          new NextResponse(asyncIteratorToStream(asyncInteratorResult), {
            headers: new Headers({
              'Content-Type': 'multipart/mixed; boundary="-"',
            }),
            status: 200,
          })
        );
      })();
    });
  }

  private async _logHandler(req: NextRequest) {
    try {
      let logs: Omit<LogData, 'batched'>[] = [];
      const body = (await req.json()) as LogData | BatchedLogData;

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

      return new NextResponse(JSON.stringify(serializeErrors({ errors: [confirmedError] })), {
        status: 500,
      });
    }
  }

  private async _requestHandler(req: NextRequest, options: ServerRequestOptions): Promise<NextResponse> {
    try {
      const body = (await req.json()) as RequestData | BatchRequestData;

      if (isRequestBatched(body)) {
        const { requests } = body;

        void new Promise(() => {
          for (const { context, request } of Object.values(requests)) {
            this._client.debugger?.log(SERVER_REQUEST_RECEIVED, { body, context, headers: req.headers, request });
          }
        });

        return this._handleBatchRequest(requests, options);
      } else {
        const { context, request } = body;
        this._client.debugger?.log(SERVER_REQUEST_RECEIVED, { body, context, headers: req.headers, request });
        return this._handleRequest(request, options, context);
      }
    } catch (error) {
      const confirmedError = isError(error)
        ? error
        : new Error('@graphql-box/server requestHandler had an unexpected error.');

      return new NextResponse(JSON.stringify(serializeErrors({ errors: [confirmedError] })), {
        status: 500,
      });
    }
  }
}
