import { type ExportResult } from '@cachemap/core';
import { type Client } from '@graphql-box/client';
import { type OperationOptions, type PartialOperationContext, type PlainObject } from '@graphql-box/core';
import { InternalError } from '@graphql-box/helpers';

export type MultiQueryExport = [req: string, options?: OperationOptions, context?: PartialOperationContext][];

export const createQueryExportServerFunc =
  (client: Client) =>
  async <Data extends PlainObject>(
    arg1: string | MultiQueryExport,
    options: OperationOptions = {},
    context: PartialOperationContext = {},
  ): Promise<PromiseSettledResult<ExportResult<Data>>[]> => {
    const operations: MultiQueryExport = Array.isArray(arg1)
      ? arg1.map(([req, opts, ctx]) => [req, { ...options, ...opts }, { ...context, ...ctx }])
      : [[arg1, options, context]];

    const exportResultPromises: Promise<ExportResult<Data>>[] = [];

    const requestHandler = async <D extends PlainObject>(
      req: string,
      opts: OperationOptions = {},
      ctx: PartialOperationContext = {},
    ): Promise<ExportResult<D>> => {
      const tag = globalThis.crypto.randomUUID();
      await client.query<D>(req, { ...opts, tag }, ctx);

      const exportResult = await client.cache?.export<D>({
        cleanupTag: true,
        tag,
      });

      if (!exportResult) {
        throw new InternalError('Export result undefined, something has gone wrong.');
      }

      return exportResult;
    };

    for (const [operation, opts, ctx] of operations) {
      exportResultPromises.push(requestHandler<Data>(operation, opts, ctx));
    }

    const settledResults = await Promise.allSettled(exportResultPromises);
    return settledResults.map(entry => structuredClone(entry));
  };
