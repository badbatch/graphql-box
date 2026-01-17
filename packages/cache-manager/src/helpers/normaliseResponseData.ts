import { type FieldPaths, type PlainObject } from '@graphql-box/core';
import { set, unset } from 'lodash-es';
import { buildEntityCacheKey } from '#helpers/buildEntityCacheKey.ts';
import { buildOperationPathCacheKey } from '#helpers/buildOperationPathCacheKey.ts';
import { buildRefTargets } from '#helpers/buildRefTargets.ts';
import { mergeCacheValues } from '#helpers/mergeCacheEntries.ts';
import { visitResponseData } from '#helpers/visitResponseData.ts';
import { type EntityCacheEntry, type OperationPathCacheEntry } from '#types.ts';

export type NormalisedResponseData = {
  entities: Record<string, EntityCacheEntry>;
  operationPaths: Record<string, OperationPathCacheEntry>;
};

export type NormalisedResponseDataOptions = {
  idKey: string;
};

export const normaliseResponseData = (
  data: PlainObject<unknown> | undefined,
  fieldPaths: FieldPaths,
  { idKey }: NormalisedResponseDataOptions,
): NormalisedResponseData => {
  const entities: Record<string, EntityCacheEntry> = {};
  const operationPaths: Record<string, OperationPathCacheEntry> = {};

  if (!data) {
    return {
      entities,
      operationPaths,
    };
  }

  visitResponseData(data, [], (responseDataValue, operationPathStack, responseKeyStack) => {
    const operationPath = operationPathStack.join('.');
    const responseKey = responseKeyStack.join('.');
    const fieldPathMetadata = fieldPaths[operationPath];

    if (!fieldPathMetadata) {
      console.debug(`Unable to resolve field path metadata for operation path "${operationPath}"`);
      return;
    }

    const { hasArgs, isEntity, isList, isRootEntity, typeName } = fieldPathMetadata;

    if (isRootEntity || isList || hasArgs) {
      const operationPathCacheKey = buildOperationPathCacheKey(operationPath, fieldPaths);
      const existingCacheEntry = operationPaths[operationPathCacheKey];

      const cacheEntryValue = existingCacheEntry
        ? mergeCacheValues(existingCacheEntry.value, responseDataValue)
        : responseDataValue;

      operationPaths[operationPathCacheKey] = {
        kind: 'operationPath',
        refTargets: buildRefTargets(cacheEntryValue),
        value: structuredClone(cacheEntryValue),
      };

      unset(data, responseKey);
      return;
    }

    if (isEntity) {
      // If isEntity is true, then responseDataValue will definitely be an object.
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const entity = responseDataValue as PlainObject<unknown>;
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
        kind: 'entity',
        refTargets: buildRefTargets(cacheEntryValue),
        // Struggling to resolve type issues, will need to revisit.
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        value: structuredClone(cacheEntryValue) as PlainObject,
      };

      set(data, responseKey, { __kind: 'entity', __ref: entityCacheKey });
    }
  });

  return {
    entities,
    operationPaths,
  };
};
