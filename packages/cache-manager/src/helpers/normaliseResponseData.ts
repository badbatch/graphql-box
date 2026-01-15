import { type FieldPathMetadata, type FieldPaths, type PlainObject } from '@graphql-box/core';
import { get, set, unset } from 'lodash-es';
import { buildEntityCacheKey } from '#helpers/buildEntityCacheKey.ts';
import { buildOperationPathCacheKey } from '#helpers/buildOperationPathCacheKey.ts';
import { buildResponseDataKey } from '#helpers/buildResponseDataPath.ts';
import { mergeCacheValues } from '#helpers/mergeCacheEntries.ts';
import { type EntityCacheEntry, type OperationPathCacheEntry } from '#types.ts';

export type NormalisedResponseData = {
  entities: Record<string, EntityCacheEntry>;
  operationPaths: Record<string, OperationPathCacheEntry>;
};

export type NormalisedResponseDataOptions = {
  idKey: string;
};

const sortFieldPathEntries = (
  [, metadataA]: [operationPath: string, fieldPathMetadata: FieldPathMetadata],
  [, metadataB]: [operationPath: string, fieldPathMetadata: FieldPathMetadata],
) => {
  return metadataB.fieldDepth - metadataA.fieldDepth;
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

  const sortedFieldPathEntries = Object.entries(fieldPaths).sort(sortFieldPathEntries);

  for (const [operationPath, { hasArgs, isEntity, isList, isRootEntity, typeName }] of sortedFieldPathEntries) {
    const responseKey = buildResponseDataKey(operationPath, fieldPaths);

    if (isRootEntity || isList || hasArgs) {
      const operationPathCacheKey = buildOperationPathCacheKey(operationPath, fieldPaths);
      const operationPathCacheEntry = operationPaths[operationPathCacheKey];

      if (operationPathCacheEntry) {
        const { value: operationPathCacheValue } = operationPathCacheEntry;
        const mergedValue = mergeCacheValues(operationPathCacheValue, get(data, responseKey));

        operationPaths[operationPathCacheKey] = {
          kind: 'operationPath',
          value: mergedValue,
        };
      } else {
        operationPaths[operationPathCacheKey] = {
          kind: 'operationPath',
          value: structuredClone(get(data, responseKey)),
        };
      }

      unset(data, responseKey);
      continue;
    }

    if (isEntity) {
      // We always inject the idKey into an operation so this field
      // will always be returned.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const idValue = data[idKey]!;
      const entityCacheKey = buildEntityCacheKey(typeName, idValue);
      const entityCacheEntry = entities[entityCacheKey];

      if (entityCacheEntry) {
        const { value: entityCacheValue } = entityCacheEntry;
        const mergedValue = mergeCacheValues(entityCacheValue, get(data, responseKey));

        entities[entityCacheKey] = {
          kind: 'entity',
          // Struggling to resolve type issues, will need to revisit.
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          value: mergedValue as PlainObject,
        };
      } else {
        entities[entityCacheKey] = {
          kind: 'entity',
          // Struggling to resolve type issues, will need to revisit.
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          value: structuredClone(get(data, responseKey)) as PlainObject,
        };

        set(data, responseKey, { __kind: 'entity', __ref: entityCacheKey });
      }
    }
  }

  return {
    entities,
    operationPaths,
  };
};
