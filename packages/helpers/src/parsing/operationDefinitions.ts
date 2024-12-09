import { type DocumentNode, Kind, type OperationDefinitionNode, type OperationTypeNode } from 'graphql';
import { getKind } from './kind.ts';

export const getOperationDefinitions = (
  { definitions }: DocumentNode,
  name?: OperationTypeNode,
): OperationDefinitionNode[] => {
  const operationDefinitions: OperationDefinitionNode[] = [];

  for (const definition of definitions) {
    if (getKind(definition) === Kind.OPERATION_DEFINITION) {
      const operationDefinition = definition as OperationDefinitionNode;
      operationDefinitions.push(operationDefinition);
    }
  }

  if (!name) {
    return operationDefinitions;
  }

  const filterdOperationDefinitions: OperationDefinitionNode[] = [];

  for (const operationDefinition of operationDefinitions) {
    if (operationDefinition.operation === name) {
      filterdOperationDefinitions.push(operationDefinition);
    }
  }

  return filterdOperationDefinitions;
};
