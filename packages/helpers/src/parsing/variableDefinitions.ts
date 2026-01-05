import { type VariableDefinitionNode, valueFromASTUntyped } from 'graphql';

export const getVariableDefinitionDefaultValue = ({ defaultValue }: VariableDefinitionNode): unknown => {
  if (!defaultValue) {
    return;
  }

  return valueFromASTUntyped(defaultValue);
};
