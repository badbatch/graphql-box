import { type DocumentNode, Kind, type OperationDefinitionNode, type OperationTypeNode } from 'graphql';
import { isKind } from './kind.ts';

export const getOperationDefinitions = (
  { definitions }: DocumentNode,
  name?: OperationTypeNode,
): OperationDefinitionNode[] => {
  const operationDefinitions: OperationDefinitionNode[] = [];

  for (const definition of definitions) {
    if (isKind<OperationDefinitionNode>(definition, Kind.OPERATION_DEFINITION)) {
      operationDefinitions.push(definition);
    }
  }

  if (!name) {
    return operationDefinitions;
  }

  const filteredOperationDefinitions: OperationDefinitionNode[] = [];

  for (const operationDefinition of operationDefinitions) {
    if (operationDefinition.operation === name) {
      filteredOperationDefinitions.push(operationDefinition);
    }
  }

  return filteredOperationDefinitions;
};
