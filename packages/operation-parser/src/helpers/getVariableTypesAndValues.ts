import { type PlainObject } from '@graphql-box/core';
import { getOperationDefinitions, getVariableDefinitionDefaultValue } from '@graphql-box/helpers';
import { type DocumentNode, type GraphQLSchema, isInputType, isNonNullType, typeFromAST } from 'graphql';
import { type VariableTypesMap } from '#types.ts';

export type GetVariableTypeAndValuesResult = {
  variableTypes: VariableTypesMap;
  variableValues: PlainObject<unknown>;
};

export const getVariableTypeAndValues = (
  ast: DocumentNode,
  schema: GraphQLSchema,
  variables?: PlainObject<unknown>,
): GetVariableTypeAndValuesResult => {
  const variableTypes: VariableTypesMap = {};
  const variableValues: PlainObject<unknown> = { ...variables };
  // We are picking the first and non-null asserting because we already have a
  // check in the caller to throw if there is more or less than one operation.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { variableDefinitions = [] } = getOperationDefinitions(ast)[0]!;

  for (const variableDefinition of variableDefinitions) {
    const { value: variableName } = variableDefinition.variable.name;
    const variableType = typeFromAST(schema, variableDefinition.type);

    if (!variableType) {
      throw new Error(`${variableName} has an unknown variable type`);
    }

    if (!isInputType(variableType)) {
      // This should never happen as GraphQL will always return
      // an input type for a variable definition.
      throw new Error(`${variableName} is not an input type`);
    }

    variableTypes[variableName] = variableType;
    const defaultValue = getVariableDefinitionDefaultValue(variableDefinition);

    if (defaultValue !== undefined && variableValues[variableName] === undefined) {
      variableValues[variableName] = defaultValue;
    }

    if (isNonNullType(variableType) && variableValues[variableName] === undefined) {
      throw new Error(`${variableName} is a non-null type, but the value was undefined`);
    }
  }

  return {
    variableTypes,
    variableValues,
  };
};
