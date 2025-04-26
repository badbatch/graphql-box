import { type Client } from '@graphql-box/client';
import {
  type PartialDehydratedRequestResult,
  type PartialRawFetchData,
  type PartialRequestResult,
  type RequestContextData,
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
  type BatchedLogDataPayload,
  type ExpressRequestHandler,
  type LogDataPayload,
  type RequestData,
  type ResponseDataWithMaybeDehydratedCacheMetadataBatch,
  type UserOptions,
} from './types.ts';

export class ExpressMiddleware {
  private _client: Client;
  private readonly _requestTimeout: number;
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

  public createLogHandler(): ExpressRequestHandler {
    return (req: Request<unknown, unknown, LogDataPayload | BatchedLogDataPayload>, res: Response) => {
      this._logHandler(req, res);
    };
  }

  public createRequestHandler(options: ServerRequestOptions = {}): ExpressRequestHandler {
    return (req: Request<unknown, unknown, RequestData | BatchRequestData>, res: Response) => {
      this._requestHandler(req, res, options);
    };
  }

  private async _handleBatchRequest(
    res: Response,
    requests: BatchRequestData['requests'],
    options: ServerRequestOptions,
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
          context.data.originalRequestHash &&
          !this._requestWhitelist.includes(context.data.originalRequestHash)
        ) {
          response.responses[requestHash] = serializeErrors({
            errors: [new Error('@graphql-box/server: The request is not whitelisted.')],
            requestID: context.data.requestID,
          });

          return;
        }

        try {
          const requestTimer = setTimeout(() => {
            response.responses[requestHash] = serializeErrors({
              errors: [
                new Error(`@graphql-box/server did not process the request within ${String(this._requestTimeout)}ms.`),
              ],
              requestID: context.data.requestID,
            });
          }, this._requestTimeout);

          // Need to make client.request a generic
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          const { _cacheMetadata, ...otherProps } = (await this._client.request(
            request,
            options,
            context,
          )) as PartialRequestResult;

          clearTimeout(requestTimer);
          // Need to implement a type guard
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
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
            requestID: context.data.requestID,
          });
        }
      }),
    );

    res.status(200).send(response);
  }

  private _handleLogs(logs: Omit<LogDataPayload, 'batched'>[]) {
    for (const { data, logLevel, message } of logs) {
      this._client.debugger?.handleLog(message, data, logLevel);
    }
  }

  private async _handleRequest(
    res: Response,
    request: string,
    options: ServerRequestOptions,
    context: { data: RequestContextData },
  ) {
    // Need to change how context gets initialised and updated

    if (this._requestWhitelist.length > 0 && !this._requestWhitelist.includes(context.data.originalRequestHash)) {
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

    const requestResult = await this._client.request(request, options, context);
    clearTimeout(requestTimer);

    if (!isAsyncIterable(requestResult)) {
      // Need to implement a type guard
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const { _cacheMetadata, ...otherProps } = requestResult as PartialRequestResult;
      const response: PartialDehydratedRequestResult = serializeErrors({ ...otherProps });

      if (_cacheMetadata) {
        response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
      }

      res.status(200).send(response);
      return;
    }

    res.setHeader('Content-Type', 'multipart/mixed; boundary="-"');

    void forAwaitEach(requestResult, ({ _cacheMetadata, ...otherProps }: PartialRequestResult) => {
      const response: PartialDehydratedRequestResult = serializeErrors({ ...otherProps });

      if (_cacheMetadata) {
        response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
      }

      writeResponseChunk(res, response);

      if (!otherProps.hasNext) {
        res.write('\r\n-----\r\n');
        res.end();
      }
    });
  }

  private _logHandler(req: Request<unknown, unknown, LogDataPayload | BatchedLogDataPayload>, res: Response) {
    try {
      let logs: Omit<LogDataPayload, 'batched'>[] = [];
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
    { body }: Request<unknown, unknown, RequestData | BatchRequestData>,
    res: Response,
    options: ServerRequestOptions,
  ) {
    try {
      if (isRequestBatched(body)) {
        const { requests } = body;

        void new Promise(() => {
          for (const { context } of Object.values(requests)) {
            this._client.debugger?.log(SERVER_REQUEST_RECEIVED, { data: context.data });
          }
        });

        void this._handleBatchRequest(res, requests, options);
      } else {
        const { context, request } = body;
        this._client.debugger?.log(SERVER_REQUEST_RECEIVED, { data: context.data });
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
