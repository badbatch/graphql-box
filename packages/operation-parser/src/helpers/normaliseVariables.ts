import { type PlainObject } from '@graphql-box/core';
import { InternalError, getOperationDefinitions, getVariableDefinitionDefaultValue } from '@graphql-box/helpers';
import {
  type DocumentNode,
  type GraphQLInputType,
  type GraphQLSchema,
  isInputType,
  isNonNullType,
  typeFromAST,
} from 'graphql';

export type NormalisedVariables = Record<
  string,
  {
    required: boolean;
    type: GraphQLInputType;
    value: unknown;
  }
>;

export const normaliseVariables = (
  ast: DocumentNode,
  schema: GraphQLSchema,
  variables: PlainObject<unknown> = {},
): NormalisedVariables => {
  const normalisedVariables: NormalisedVariables = {};
  // We are picking the first and non-null asserting because we already have a
  // check in the caller to throw if there is more or less than one operation.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { variableDefinitions = [] } = getOperationDefinitions(ast)[0]!;

  for (const variableDefinition of variableDefinitions) {
    const { value: variableName } = variableDefinition.variable.name;
    const variableType = typeFromAST(schema, variableDefinition.type);

    if (!variableType) {
      throw new InternalError(`${variableName} has an unknown variable type`);
    }

    if (!isInputType(variableType)) {
      // This should never happen as GraphQL will always return
      // an input type for a variable definition.
      throw new InternalError(`${variableName} is not an input type`);
    }

    const defaultValue = getVariableDefinitionDefaultValue(variableDefinition);
    const incomingValue = variables[variableName];

    normalisedVariables[variableName] = {
      required: isNonNullType(variableType) && defaultValue === undefined,
      type: variableType,
      value: defaultValue !== undefined && incomingValue === undefined ? defaultValue : incomingValue,
    };
  }

  return normalisedVariables;
};
