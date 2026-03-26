import { type CacheMetadata } from '@graphql-box/core';

export class QueryError extends Error {
  public name = 'QueryError';

  constructor(
    public message: string,
    public errors: Error[] | readonly Error[],
    public extensions: Record<string, unknown> & { cacheMetadata: CacheMetadata },
    public operationId: string,
  ) {
    super(message);
  }
}
