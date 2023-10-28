import { isKind } from '@graphql-box/helpers';
import { type DocumentNode, type FragmentDefinitionNode, Kind, type OperationDefinitionNode } from 'graphql';

export const filterOperationAndFragmentDefinitions = (ast: DocumentNode) => {
  return ast.definitions.filter(
    definition =>
      isKind<OperationDefinitionNode>(definition, Kind.OPERATION_DEFINITION) ||
      isKind<FragmentDefinitionNode>(definition, Kind.FRAGMENT_DEFINITION)
  ) as (OperationDefinitionNode | FragmentDefinitionNode)[];
};
