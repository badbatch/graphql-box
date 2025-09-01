import { type FieldPathMetadata } from '#FieldPathManager.ts';

export const getEdgeIterations = (
  typeName: string | undefined,
  parentFieldPathMetadata: FieldPathMetadata | undefined,
): number | undefined => (typeName?.endsWith('Edge') ? parentFieldPathMetadata?.connectionIterations : undefined);
