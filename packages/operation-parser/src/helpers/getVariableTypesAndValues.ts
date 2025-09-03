import { type PlainObject } from '@graphql-box/core';
import {
  getOperationDefinitions,
  getVariableDefinitionDefaultValue,
  getVariableDefinitionType,
} from '@graphql-box/helpers';
import { type DocumentNode, type GraphQLSchema } from 'graphql';
import { type Jsonifiable } from 'type-fest';
import { type VariableTypesMap } from '#types.ts';

export type GetVariableTypeAndValuesResult = {
  variableTypes: VariableTypesMap;
  variableValues: PlainObject<Jsonifiable>;
};

export const getVariableTypeAndValues = (
  ast: DocumentNode,
  schema: GraphQLSchema,
  variables?: PlainObject<Jsonifiable>,
): GetVariableTypeAndValuesResult => {
  const variableTypes: VariableTypesMap = {};
  const variableValues: PlainObject<Jsonifiable> = { ...variables };
  // We are picking the first and non-null asserting because we already have a
  // check in the caller to throw if there is more or less than one operation.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { variableDefinitions = [] } = getOperationDefinitions(ast)[0]!;

  for (const variableDefinition of variableDefinitions) {
    const variableName = variableDefinition.variable.name.value;
    variableTypes[variableName] = schema.getType(getVariableDefinitionType(variableDefinition));
    const defaultValue = getVariableDefinitionDefaultValue(variableDefinition);

    if (defaultValue !== undefined && variableValues[variableName] === undefined) {
      variableValues[variableName] = defaultValue;
    }
  }

  return {
    variableTypes,
    variableValues,
  };
};
