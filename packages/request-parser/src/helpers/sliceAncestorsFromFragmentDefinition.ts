import { FRAGMENT_DEFINITION, isKind } from "@graphql-box/helpers";
import { FragmentDefinitionNode } from "graphql";

export default (ancestors: ReadonlyArray<any>) => {
  const index = ancestors.findIndex(ancestor => isKind<FragmentDefinitionNode>(ancestor, FRAGMENT_DEFINITION));
  return ancestors.slice(index + 1);
};
