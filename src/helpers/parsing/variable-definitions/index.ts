import { OperationDefinitionNode } from "graphql";

export function deleteVariableDefinitions(operationDefinition: OperationDefinitionNode): void {
  operationDefinition.variableDefinitions = null;
}

export function hasVariableDefinitions({ variableDefinitions }: OperationDefinitionNode): boolean {
  return variableDefinitions && !!variableDefinitions.length;
}
