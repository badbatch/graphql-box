import { getAlias, getArguments } from '@graphql-box/helpers';
import { type FieldNode } from 'graphql';
import { buildAncestorFieldNames } from '#helpers/buildAncestorFieldNames.ts';
import { buildFieldCachePath } from '#helpers/buildFieldCachePath.ts';
import { buildFieldOperationPath } from '#helpers/buildFieldOperationPath.ts';
import { buildFieldResponsePath } from '#helpers/buildFieldResponsePath.ts';
import { connectionIteratorCallback } from '#helpers/connectionIteratorCallback.ts';
import { explodePathParts } from '#helpers/explodePathParts.ts';
import { getPathParts } from '#helpers/getPathParts.ts';
import { populateFieldArgs } from '#helpers/populateFieldArgs.ts';
import { type Ancestor, type CalculateIteratorCallback } from '#types.ts';

export type FieldPathMetadata = {
  cachePath: string;
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
  variables?: Record<string, unknown>;
};

export class FieldPathManager {
  private _calculateIteratorCallback: CalculateIteratorCallback = connectionIteratorCallback;
  private _fieldPaths: Record<string, FieldPathMetadata> = {};

  public addPath(
    field: FieldNode,
    ancestors: readonly Ancestor[],
    { isTypeDefList, isTypeScalar, typeName, variables }: AddPathOptions,
  ): void {
    const ancestorFieldNames = buildAncestorFieldNames(ancestors);
    const parentFieldPath = ancestorFieldNames.join('.');
    const parentFieldPathMetadata = this._fieldPaths[parentFieldPath];
    const fieldName = getAlias(field) ?? field.name.value;
    const populatedFieldArgs = populateFieldArgs(getArguments(field), variables);

    const iterations = this._calculateIteratorCallback({
      fieldTypeName: typeName,
      isFieldTypeList: isTypeDefList,
      variables,
    });

    const fieldOperationPath = buildFieldOperationPath(fieldName, parentFieldPath);

    const fieldCachePath = buildFieldCachePath(
      fieldName,
      parentFieldPathMetadata?.cachePath,
      populatedFieldArgs,
      iterations,
    );

    const fieldResponsePath = buildFieldResponsePath(fieldName, parentFieldPathMetadata?.responsePath, iterations);

    this._fieldPaths[fieldOperationPath] = {
      cachePath: fieldCachePath,
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
