import { type ExportResult } from '@cachemap/core';
import { type Client } from '@graphql-box/client';
import { type OperationOptions, type PartialOperationContext, type PlainObject } from '@graphql-box/core';

export type MultiQueryExport = [req: string, options?: OperationOptions, context?: PartialOperationContext][];

export const createQueryExportServerFunc =
  (client: Client, factoryContext: PartialOperationContext) =>
  async <Data extends PlainObject>(
    arg1: string | MultiQueryExport,
    options: OperationOptions = {},
    context: PartialOperationContext,
  ): Promise<ExportResult<Data>[]> => {
    const mergedContext = {
      ...factoryContext,
      ...context,
      data: {
        ...factoryContext.data,
        ...context.data,
      },
    };

    const operations: MultiQueryExport = Array.isArray(arg1)
      ? arg1.map(([req, opts, ctx]) => [req, { ...options, ...opts }, { ...mergedContext, ...ctx }])
      : [[arg1, options, mergedContext]];

    const importOptionPromises: Promise<ExportResult<Data>>[] = [];

    const requestHandler = async <D extends PlainObject>(
      req: string,
      opts: OperationOptions = {},
      ctx: PartialOperationContext = {},
    ): Promise<ExportResult<D>> => {
      const tag = globalThis.crypto.randomUUID();
      await client.query<D>(req, opts, ctx);

      const exportResult = await client.cacheManager.cache?.export<D>({
        tag,
      });

      if (!exportResult) {
        throw new Error('Export result undefined, something has gone wrong.');
      }

      return exportResult;
    };

    for (const [operation, opts, ctx] of operations) {
      importOptionPromises.push(requestHandler<Data>(operation, opts, ctx));
    }

    const importOptions = await Promise.all(importOptionPromises);
    return importOptions.map(entry => structuredClone(entry));
  };
