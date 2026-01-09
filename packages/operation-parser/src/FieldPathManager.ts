import { type PlainObject } from '@graphql-box/core';
import { getAlias, getArguments } from '@graphql-box/helpers';
import { type FieldNode } from 'graphql';
import { pickBy } from 'lodash-es';

export type FieldPathMetadata = {
  fieldAlias?: string;
  fieldArgs?: PlainObject<unknown>;
  hasArgs?: true;
  isAbstract?: true;
  isEntity?: true;
  isLeaf?: true;
  isList?: true;
  leafEntity?: string;
  typeConditions?: Set<string>;
  typeName: string;
};

export type AddFieldPathOptions = {
  fieldPathStack: string[];
  hasArgs: boolean;
  isAbstract: boolean;
  isEntity: boolean;
  isLeaf: boolean;
  isList: boolean;
  leafEntity: string | undefined;
  typeConditions: string[];
  typeName: string;
};

export class FieldPathManager {
  private _fieldPaths: Record<string, FieldPathMetadata> = {};

  public addFieldPath(
    field: FieldNode,
    {
      fieldPathStack,
      hasArgs,
      isAbstract,
      isEntity,
      isLeaf,
      isList,
      leafEntity,
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
