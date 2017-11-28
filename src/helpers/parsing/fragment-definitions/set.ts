import { FieldNode, FragmentSpreadNode } from "graphql";
import getKind from "../kind/get";
import getName from "../name/get";
import { FragmentDefinitionNodeMap } from "../types";

export default function setFragmentDefinitions(fragmentDefinitions: FragmentDefinitionNodeMap, node: FieldNode): void {
  if (!node.selectionSet) return;
  const { selections } = node.selectionSet;

  for (let i = selections.length - 1; i >= 0; i -= 1) {
    if (getKind(selections[i]) === "FragmentSpread") {
      const fragmentSpread = selections[i] as FragmentSpreadNode;
      const name = getName(fragmentSpread);
      if (!name) continue;
      const { selectionSet } = fragmentDefinitions[name];
      if (!selectionSet) return;
      selections.splice(i, 1, ...selectionSet.selections);
    }
  }
}
