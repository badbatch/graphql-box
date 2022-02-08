import { OPERATION_DEFINITION, isKind } from "@graphql-box/helpers";
import { DefinitionNode, OperationDefinitionNode } from "graphql";

export default (definitions: DefinitionNode[]) => {
  definitions.sort((a, b) => {
    if (
      isKind<OperationDefinitionNode>(a, OPERATION_DEFINITION) &&
      !isKind<OperationDefinitionNode>(b, OPERATION_DEFINITION)
    ) {
      return -1;
    }

    if (
      !isKind<OperationDefinitionNode>(a, OPERATION_DEFINITION) &&
      isKind<OperationDefinitionNode>(b, OPERATION_DEFINITION)
    ) {
      return 1;
    }

    return 0;
  });
};
