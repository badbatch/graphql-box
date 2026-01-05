import { type GraphQLInputType, type ValueNode, astFromValue } from 'graphql';

export const replaceVariableNodeWithValueNode = (
  variableType: GraphQLInputType,
  variableValue?: unknown,
): ValueNode => {
  const valueNode = astFromValue(variableValue, variableType);

  if (!valueNode) {
    throw new Error('Could not convert variable value to AST');
  }

  return valueNode;
};
