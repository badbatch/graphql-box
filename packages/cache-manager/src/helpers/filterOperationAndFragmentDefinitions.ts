import { FRAGMENT_DEFINITION, OPERATION_DEFINITION, isKind } from "@graphql-box/helpers";
import { DocumentNode, FragmentDefinitionNode, OperationDefinitionNode } from "graphql";

export default (ast: DocumentNode) => {
  return ast.definitions.filter(
    definition =>
      isKind<OperationDefinitionNode>(definition, OPERATION_DEFINITION) ||
      isKind<FragmentDefinitionNode>(definition, FRAGMENT_DEFINITION),
  ) as (OperationDefinitionNode | FragmentDefinitionNode)[];
};
