import { OperationDefinitionNode } from "graphql";

export function deleteVariableDefinitions(operationDefinition: OperationDefinitionNode): void {
  operationDefinition.variableDefinitions = undefined;
}

export function hasVariableDefinitions({ variableDefinitions }: OperationDefinitionNode): boolean {
  return !!variableDefinitions && !!variableDefinitions.length;
}
