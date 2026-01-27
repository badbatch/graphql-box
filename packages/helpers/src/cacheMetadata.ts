import { type CacheMetadata, type Entity, type FieldPaths } from '@graphql-box/core';
import { Cacheability } from 'cacheability';
import { type GraphQLResolveInfo } from 'graphql';
import { buildEntityCacheKey } from '#buildEntityCacheKey.ts';
import { buildOperationPathCacheKey } from '#buildOperationPathCacheKey.ts';
import { getOperationPathFromResolverInfo } from '#getOperationPathFromResolverInfo.ts';

export const setCacheMetadata =
  (cacheMetadata: CacheMetadata, fieldPaths: FieldPaths, idKey: string) =>
  (data: unknown, info: GraphQLResolveInfo, headers: Headers) => {
    const operationPath = getOperationPathFromResolverInfo(info);
    const fieldPathMetadata = fieldPaths[operationPath];

    if (!fieldPathMetadata) {
      return;
    }

    const { hasArgs, isEntity, isList, isRootPath } = fieldPathMetadata;
    const incomingCacheability = new Cacheability({ headers });

    if (hasArgs || isList || isRootPath) {
      const operationPathCacheKey = buildOperationPathCacheKey(operationPath, fieldPaths);

      if (operationPathCacheKey) {
        cacheMetadata[operationPathCacheKey] = incomingCacheability.metadata;
      }
    }

    if (isEntity) {
      // isEntity is derived upstream so typescript cannot derive that data
      // has to be a plain object.
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const entity = data as Entity;
      const entityCacheKey = buildEntityCacheKey(entity.__typename, entity[idKey]);

      if (!entityCacheKey) {
        return;
      }

      const existingCacheMetadata = cacheMetadata[entityCacheKey];

      if (existingCacheMetadata) {
        if (existingCacheMetadata.ttl < incomingCacheability.metadata.ttl) {
          cacheMetadata[entityCacheKey] = incomingCacheability.metadata;
        }
      } else {
        cacheMetadata[entityCacheKey] = incomingCacheability.metadata;
      }
    }
  };
