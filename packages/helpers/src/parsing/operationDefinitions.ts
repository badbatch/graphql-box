import {
  type DefinitionNode,
  type DocumentNode,
  Kind,
  type OperationDefinitionNode,
  type OperationTypeNode,
} from 'graphql';
import { getKind } from './kind.ts';

export const getOperationDefinitions = (
  { definitions }: DocumentNode,
  name?: OperationTypeNode,
): OperationDefinitionNode[] => {
  const operationDefinitions: OperationDefinitionNode[] = [];

  const isOperationDefinitionNode = (n: DefinitionNode): n is OperationDefinitionNode =>
    getKind(n) === Kind.OPERATION_DEFINITION;

  for (const definition of definitions) {
    if (isOperationDefinitionNode(definition)) {
      operationDefinitions.push(definition);
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
