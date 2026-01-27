import { type FieldPathMetadata } from '@graphql-box/core';
import { getAlias, getArguments } from '@graphql-box/helpers';
import { type FieldNode, type GraphQLSchema } from 'graphql';
import { pickBy } from 'lodash-es';
import { buildRequiredFields } from '#helpers/buildRequiredFields.ts';

export type AddFieldPathOptions = {
  fieldDepth: number;
  fieldPathStack: string[];
  hasArgs: boolean;
  isAbstract: boolean;
  isEntity: boolean;
  isLeaf: boolean;
  isList: boolean;
  isRootPath: boolean;
  leafEntity: string | undefined;
  pathCacheKey: string;
  pathResponseKey: string;
  typeConditions: string[];
  typeName: string;
};

export class FieldPathManager {
  private _fieldPaths: Record<string, FieldPathMetadata> = {};

  constructor(private _schema: GraphQLSchema) {}

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
      isRootPath,
      leafEntity,
      pathCacheKey,
      pathResponseKey,
      typeConditions,
      typeName,
    }: AddFieldPathOptions,
  ): void {
    const fieldPath = fieldPathStack.join('.');
    const existingFieldPath = this._fieldPaths[fieldPath];
    const fieldAlias = getAlias(field);
    const fieldArgs = getArguments(field);

    if (existingFieldPath) {
      if (typeConditions.length === 0) {
        return;
      }

      for (const typeCondition of typeConditions) {
        existingFieldPath.typeConditions ??= [];

        if (!existingFieldPath.typeConditions.includes(typeCondition)) {
          existingFieldPath.typeConditions.push(typeCondition);
        }
      }

      return;
    }

    this._fieldPaths[fieldPath] = {
      fieldDepth,
      pathCacheKey,
      pathResponseKey,
      typeName,
      ...pickBy(
        {
          fieldArgs,
          fieldName: fieldAlias ? field.name.value : undefined,
          hasAlias: !!fieldAlias,
          hasArgs,
          isAbstract,
          isEntity,
          isLeaf,
          isList,
          isRootPath,
          leafEntity,
          requiredFields: isEntity ? buildRequiredFields(field, typeName, this._schema) : undefined,
          typeConditions: typeConditions.length > 0 ? typeConditions : undefined,
        },
        v => v !== undefined && v !== false,
      ),
    };
  }

  get fieldPaths() {
    return this._fieldPaths;
  }
}
