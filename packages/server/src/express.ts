import { type Client } from '@graphql-box/client';
import {
  type PartialRawFetchData,
  type PartialRequestContext,
  type PartialRequestResult,
  type PartialRequestResultWithDehydratedCacheMetadata,
  SERVER_REQUEST_RECEIVED,
  type ServerRequestOptions,
} from '@graphql-box/core';
import { ArgsError, GroupedError, dehydrateCacheMetadata, serializeErrors } from '@graphql-box/helpers';
import { type Request, type Response } from 'express';
import { forAwaitEach, isAsyncIterable } from 'iterall';
import { isError, isPlainObject } from 'lodash-es';
import { isLogBatched } from './helpers/isLogBatched.ts';
import { isRequestBatched } from './helpers/isRequestBatched.ts';
import { writeResponseChunk } from './helpers/writeResponseChunk.ts';
import {
  type BatchRequestData,
  type BatchedLogData,
  type LogData,
  type RequestData,
  type RequestHandler,
  type ResponseDataWithMaybeDehydratedCacheMetadataBatch,
  type UserOptions,
} from './types.ts';

export class ExpressMiddleware {
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

  public createLogHandler(): RequestHandler {
    return (req: Request<unknown, unknown, LogData | BatchedLogData>, res: Response) => {
      this._logHandler(req, res);
    };
  }

  public createRequestHandler(options: ServerRequestOptions = {}): RequestHandler {
    return (req: Request<unknown, unknown, RequestData | BatchRequestData>, res: Response) => {
      this._requestHandler(req, res, options);
    };
  }

  private async _handleBatchRequest(
    res: Response,
    requests: BatchRequestData['requests'],
    options: ServerRequestOptions
  ) {
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

    res.status(200).send(response);
  }

  private _handleLogs(logs: Omit<LogData, 'batched'>[]) {
    for (const { data, logLevel, message } of logs) {
      this._client.debugger?.handleLog(message, data, logLevel);
    }
  }

  private async _handleRequest(
    res: Response,
    request: string,
    options: ServerRequestOptions,
    context: PartialRequestContext
  ) {
    if (this._requestWhitelist.length > 0 && !this._requestWhitelist.includes(context.originalRequestHash!)) {
      res.status(400).send(serializeErrors({ errors: [new Error('The request is not whitelisted.')] }));
      return;
    }

    const requestTimer = setTimeout(() => {
      res.status(408).send(
        serializeErrors({
          errors: [new Error(`@graphql-box/server did not process the request within ${this._requestTimeout}ms.`)],
        })
      );
    }, this._requestTimeout);

    const requestResult = await this._client.request(request, options, context);
    clearTimeout(requestTimer);

    if (!isAsyncIterable(requestResult)) {
      const { _cacheMetadata, ...otherProps } = requestResult as PartialRequestResult;
      const response: PartialRequestResultWithDehydratedCacheMetadata = { ...otherProps };

      if (_cacheMetadata) {
        response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
      }

      res.status(200).send(serializeErrors(response));
      return;
    }

    res.setHeader('Content-Type', 'multipart/mixed; boundary="-"');

    void forAwaitEach(requestResult, ({ _cacheMetadata, ...otherProps }: PartialRequestResult) => {
      const response: PartialRequestResultWithDehydratedCacheMetadata = { ...otherProps };

      if (_cacheMetadata) {
        response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
      }

      writeResponseChunk(res, serializeErrors(response));

      if (!otherProps.hasNext) {
        res.write('\r\n-----\r\n');
        res.end();
      }
    });
  }

  private _logHandler(req: Request<unknown, unknown, LogData | BatchedLogData>, res: Response) {
    try {
      let logs: Omit<LogData, 'batched'>[] = [];
      const { body } = req;

      if (isLogBatched(body)) {
        logs = Object.values(body.requests);
      } else {
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
    { body, headers }: Request<unknown, unknown, RequestData | BatchRequestData>,
    res: Response,
    options: ServerRequestOptions
  ) {
    try {
      if (isRequestBatched(body)) {
        const { requests } = body;

        void new Promise(() => {
          for (const { context, request } of Object.values(requests)) {
            this._client.debugger?.log(SERVER_REQUEST_RECEIVED, { body, context, headers, request });
          }
        });

        void this._handleBatchRequest(res, requests, options);
      } else {
        const { context, request } = body;
        this._client.debugger?.log(SERVER_REQUEST_RECEIVED, { body, context, headers, request });
        void this._handleRequest(res, request, options, context);
      }
    } catch (error) {
      const confirmedError = isError(error)
        ? error
        : new Error('@graphql-box/server requestHandler had an unexpected error.');

      res.status(500).send(serializeErrors({ errors: [confirmedError] }));
    }
  }
}
