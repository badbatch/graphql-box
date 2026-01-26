import { type CacheMetadata, type Entity, type FieldPaths, type PlainObject } from '@graphql-box/core';
import { buildEntityCacheKey, buildOperationPathCacheKey } from '@graphql-box/helpers';
import { Cacheability } from 'cacheability';
import { set, unset } from 'lodash-es';
import { buildRefTargets } from '#helpers/buildRefTargets.ts';
import { mergeCacheValues } from '#helpers/mergeCacheEntries.ts';
import { visitResponseData } from '#helpers/visitResponseData.ts';
import { type EntityCacheEntry, type OperationPathCacheEntry } from '#types.ts';

export type NormalisedResponseData = {
  entities: Record<string, EntityCacheEntry>;
  operationPaths: Record<string, OperationPathCacheEntry>;
};

export type NormalisedResponseDataOptions = {
  fallbackCacheControlDirectives: string;
  idKey: string;
};

export const normaliseResponseData = (
  data: PlainObject<unknown> | undefined,
  extensions: Record<string, unknown> & { cacheMetadata: CacheMetadata },
  fieldPaths: FieldPaths,
  { fallbackCacheControlDirectives, idKey }: NormalisedResponseDataOptions,
): NormalisedResponseData => {
  const entities: Record<string, EntityCacheEntry> = {};
  const operationPaths: Record<string, OperationPathCacheEntry> = {};

  if (!data) {
    return {
      entities,
      operationPaths,
    };
  }

  const { cacheMetadata } = extensions;
  const { metadata: fallbackCacheability } = new Cacheability({ cacheControl: fallbackCacheControlDirectives });

  visitResponseData(data, [], [], (responseDataValue, operationPathStack, responseKeyStack) => {
    if (operationPathStack.length === 0) {
      return;
    }

    const isIndexNode = typeof responseKeyStack.at(-1) === 'number';
    const operationPath = operationPathStack.join('.');
    const responseKey = responseKeyStack.join('.');
    const fieldPathMetadata = fieldPaths[operationPath];

    if (!fieldPathMetadata) {
      return;
    }

    const { hasArgs, isEntity, isList, isRootEntity, typeName } = fieldPathMetadata;

    if (isEntity) {
      // If isEntity is true, then responseDataValue will definitely be an object.
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const entity = responseDataValue as Entity;
      // We always inject the idKey into an operation so this field
      // will always be returned.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const idValue = entity[idKey]!;
      const entityCacheKey = buildEntityCacheKey(typeName, idValue);
      const existingCacheEntry = entities[entityCacheKey];

      const cacheEntryValue = existingCacheEntry
        ? mergeCacheValues(existingCacheEntry.value, responseDataValue)
        : responseDataValue;

      entities[entityCacheKey] = {
        extensions: {
          cacheability: cacheMetadata[entityCacheKey] ?? fallbackCacheability,
        },
        kind: 'entity',
        refTargets: buildRefTargets(cacheEntryValue, fieldPaths, operationPathStack),
        // Struggling to resolve type issues, will need to revisit.
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        value: structuredClone(cacheEntryValue) as Entity,
      };

      responseDataValue = { __kind: 'entity', __ref: entityCacheKey };
      set(data, responseKey, responseDataValue);
    }

    if (isRootEntity || (isList && !isIndexNode) || hasArgs) {
      const operationPathCacheKey = buildOperationPathCacheKey(operationPath, fieldPaths);
      const existingCacheEntry = operationPaths[operationPathCacheKey];

      const cacheEntryValue = existingCacheEntry
        ? mergeCacheValues(existingCacheEntry.value, responseDataValue)
        : responseDataValue;

      operationPaths[operationPathCacheKey] = {
        extensions: {
          cacheability: cacheMetadata[operationPathCacheKey] ?? fallbackCacheability,
          fieldPathMetadata,
        },
        kind: 'operationPath',
        refTargets: buildRefTargets(cacheEntryValue, fieldPaths, operationPathStack),
        value: structuredClone(cacheEntryValue),
      };

      unset(data, responseKey);
    }
  });

  return {
    entities,
    operationPaths,
  };
};
