import { type FieldPathMetadata } from '@graphql-box/core';
import { getAlias, getArguments } from '@graphql-box/helpers';
import { type FieldNode } from 'graphql';
import { pickBy } from 'lodash-es';

export type AddFieldPathOptions = {
  fieldDepth: number;
  fieldPathStack: string[];
  hasArgs: boolean;
  isAbstract: boolean;
  isEntity: boolean;
  isLeaf: boolean;
  isList: boolean;
  isRootEntity: boolean;
  leafEntity: string | undefined;
  pathCacheKey: string;
  pathResponseKey: string;
  typeConditions: string[];
  typeName: string;
};

export class FieldPathManager {
  private _fieldPaths: Record<string, FieldPathMetadata> = {};

  public addFieldPath(
    field: FieldNode,
    {
      fieldDepth,
      fieldPathStack,
      hasArgs,
      isAbstract,
      isEntity,
      isLeaf,
      isList,
      isRootEntity,
      leafEntity,
      pathCacheKey,
      pathResponseKey,
      typeConditions,
      typeName,
    }: AddFieldPathOptions,
  ): void {
    const fieldPath = fieldPathStack.join('.');
    const fieldArgs = getArguments(field);
    const existingFieldPath = this._fieldPaths[fieldPath];

    if (existingFieldPath) {
      if (typeConditions.length > 0) {
        existingFieldPath.typeConditions = new Set([...typeConditions, ...(existingFieldPath.typeConditions ?? [])]);
      }
    } else {
      this._fieldPaths[fieldPath] = {
        fieldDepth,
        pathCacheKey,
        pathResponseKey,
        typeName,
        ...pickBy(
          {
            fieldAlias: getAlias(field),
            fieldArgs,
            hasArgs,
            isAbstract,
            isEntity,
            isLeaf,
            isList,
            isRootEntity,
            leafEntity,
            typeConditions: typeConditions.length > 0 ? new Set(typeConditions) : undefined,
          },
          v => v !== undefined && v !== false,
        ),
      };
    }
  }

  get fieldPaths() {
    return this._fieldPaths;
  }
}
