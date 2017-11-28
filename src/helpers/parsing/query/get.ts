import { DocumentNode, OperationDefinitionNode } from "graphql";

export default function getQuery({ definitions }: DocumentNode): OperationDefinitionNode | void {
  for (const definition of definitions) {
    if (definition.hasOwnProperty("operation")) {
      const operationDefinitionNode = definition as OperationDefinitionNode;
      if (operationDefinitionNode.operation === "query") return operationDefinitionNode;
    }
  }
}
