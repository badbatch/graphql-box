import { type FieldPathMetadata } from '@graphql-box/core';

export const sortFieldPathEntries =
  (sort: 'asc' | 'desc' = 'desc') =>
  (
    [, metadataA]: [operationPath: string, fieldPathMetadata: FieldPathMetadata],
    [, metadataB]: [operationPath: string, fieldPathMetadata: FieldPathMetadata],
  ) => {
    return sort === 'desc' ? metadataB.fieldDepth - metadataA.fieldDepth : metadataA.fieldDepth - metadataB.fieldDepth;
  };
