import { buildAncestorFieldNames, buildFieldOperationPath, getAlias, getArguments } from '@graphql-box/helpers';
import { type FieldNode } from 'graphql';
import { buildFieldCachePath } from '#helpers/buildFieldCachePath.ts';
import { buildFieldResponsePath } from '#helpers/buildFieldResponsePath.ts';
import { explodePathParts } from '#helpers/explodePathParts.ts';
import { getConnectionIterations } from '#helpers/getConnectionIterations.ts';
import { getEdgeIterations } from '#helpers/getEdgeIterations.ts';
import { getPathParts } from '#helpers/getPathParts.ts';
import { type Ancestor } from '#types.ts';

export type FieldPathMetadata = {
  cachePath: string;
  connectionIterations?: number;
  isTypeDefList: boolean;
  isTypeScalar: boolean;
  responsePath: string;
};

export type LeafFieldPathMetadata = {
  cachePaths: string[];
  responsePaths: string[];
};

export type AddPathOptions = {
  isTypeDefList: boolean;
  isTypeScalar: boolean;
  typeName?: string;
};

export class FieldPathManager {
  private _fieldPaths: Record<string, FieldPathMetadata> = {};

  public addPath(
    field: FieldNode,
    ancestors: readonly Ancestor[],
    { isTypeDefList, isTypeScalar, typeName }: AddPathOptions,
  ): void {
    const ancestorFieldNames = buildAncestorFieldNames(ancestors);
    const parentFieldPath = ancestorFieldNames.join('.');
    const parentFieldPathMetadata = this._fieldPaths[parentFieldPath];
    const fieldName = getAlias(field) ?? field.name.value;
    const fieldArgs = getArguments(field);
    const fieldOperationPath = buildFieldOperationPath(fieldName, parentFieldPath);
    const iterations = getEdgeIterations(typeName, parentFieldPathMetadata);

    const fieldCachePath = buildFieldCachePath(
      field.name.value,
      parentFieldPathMetadata?.cachePath,
      fieldArgs,
      iterations,
    );

    const fieldResponsePath = buildFieldResponsePath(fieldName, parentFieldPathMetadata?.responsePath, iterations);

    this._fieldPaths[fieldOperationPath] = {
      cachePath: fieldCachePath,
      connectionIterations: getConnectionIterations(typeName, fieldArgs),
      isTypeDefList,
      isTypeScalar,
      responsePath: fieldResponsePath,
    };
  }

  get leafFieldPaths(): Record<string, LeafFieldPathMetadata> {
    const leafPaths: Record<string, LeafFieldPathMetadata> = {};

    for (const [operationPath, { cachePath, isTypeScalar, responsePath }] of Object.entries(this._fieldPaths)) {
      if (isTypeScalar) {
        leafPaths[operationPath] = {
          cachePaths: explodePathParts(getPathParts(cachePath)),
          responsePaths: explodePathParts(getPathParts(responsePath)),
        };
      }
    }

    return leafPaths;
  }
}
