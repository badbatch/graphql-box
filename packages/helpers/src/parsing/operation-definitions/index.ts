import { DocumentNode, OperationDefinitionNode } from "graphql";
import { OPERATION_DEFINITION } from "../../consts";
import { getKind } from "../kind";

export function getOperationDefinitions({ definitions }: DocumentNode, name?: string): OperationDefinitionNode[] {
  const operationDefinitions: OperationDefinitionNode[] = [];

  definitions.forEach((definition) => {
    if (getKind(definition) === OPERATION_DEFINITION) {
      const operationDefinition = definition as OperationDefinitionNode;
      operationDefinitions.push(operationDefinition);
    }
  });

  if (!name) return operationDefinitions;

  const filterdOperationDefinitions: OperationDefinitionNode[] = [];

  operationDefinitions.forEach((operationDefinition) => {
    if (operationDefinition.operation === name) {
      filterdOperationDefinitions.push(operationDefinition);
    }
  });

  return filterdOperationDefinitions;
}
