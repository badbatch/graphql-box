import { DocumentNode, FieldNode, FragmentDefinitionNode, FragmentSpreadNode } from "graphql";
import { getKind } from "../kind";
import { getName } from "../name";
import { FragmentDefinitionNodeMap } from "../types";

export function deleteFragmentDefinitions({ definitions }: DocumentNode): void {
  for (let i = definitions.length - 1; i >= 0; i -= 1) {
    if (getKind(definitions[i]) === "FragmentDefinition") {
      definitions.splice(i, 1);
    }
  }
}

export  function getFragmentDefinitions({ definitions }: DocumentNode): FragmentDefinitionNodeMap | undefined {
  const fragmentDefinitions: FragmentDefinitionNodeMap = {};

  definitions.forEach((value) => {
    if (getKind(value) === "FragmentDefinition") {
      const fragmentDefinitionNode = value as FragmentDefinitionNode;
      const name = getName(fragmentDefinitionNode);
      if (!name) return;
      fragmentDefinitions[name] = fragmentDefinitionNode;
    }
  });

  if (!Object.keys(fragmentDefinitions).length) return undefined;
  return fragmentDefinitions;
}

export function hasFragmentDefinitions({ definitions }: DocumentNode): boolean {
  return definitions.some((value) => getKind(value) === "FragmentDefinition");
}

export function setFragmentDefinitions(fragmentDefinitions: FragmentDefinitionNodeMap, node: FieldNode): void {
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
