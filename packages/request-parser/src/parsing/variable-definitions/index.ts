import { OperationDefinitionNode } from "graphql";

export function deleteVariableDefinitions(operationDefinition: OperationDefinitionNode): OperationDefinitionNode {
  return {
    ...operationDefinition,
    variableDefinitions: undefined,
  };
}

export function hasVariableDefinitions({ variableDefinitions }: OperationDefinitionNode): boolean {
  return !!variableDefinitions && !!variableDefinitions.length;
}
