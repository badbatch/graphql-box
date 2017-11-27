import { FieldNode } from "graphql";
import getKind from "../../get-kind";
import getName from "../../get-name";
import { FragmentDefinitionNodeMap } from "../../types";

export default function setFragmentDefinitions(
  fragmentDefinitions: FragmentDefinitionNodeMap,
  { selectionSet: { selections } }: FieldNode,
): void {
  for (let i = selections.length - 1; i >= 0; i -= 1) {
    if (getKind(selections[i]) === "FragmentSpread") {
      const { selectionSet } = fragmentDefinitions[getName(selections[i])];
      selections.splice(i, 1, ...selectionSet.selections);
    }
  }
}
