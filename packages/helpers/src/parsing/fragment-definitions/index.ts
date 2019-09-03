import { DocumentNode, FieldNode, FragmentDefinitionNode, FragmentSpreadNode } from "graphql";
import { FRAGMENT_DEFINITION, FRAGMENT_SPREAD } from "../../consts";
import { FragmentDefinitionNodeMap } from "../../defs";
import { getKind } from "../kind";
import { getName } from "../name";

export function deleteFragmentDefinitions(documentNode: DocumentNode): DocumentNode {
  const definitions = [...documentNode.definitions];

  for (let i = definitions.length - 1; i >= 0; i -= 1) {
    if (getKind(definitions[i]) === FRAGMENT_DEFINITION) {
      definitions.splice(i, 1);
    }
  }

  return {
    ...documentNode,
    definitions,
  };
}

export function getFragmentDefinitions({ definitions }: DocumentNode): FragmentDefinitionNodeMap | undefined {
  const fragmentDefinitions: FragmentDefinitionNodeMap = {};

  definitions.forEach(value => {
    if (getKind(value) === FRAGMENT_DEFINITION) {
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
  return definitions.some(value => getKind(value) === FRAGMENT_DEFINITION);
}

export function setFragmentDefinitions(fragmentDefinitions: FragmentDefinitionNodeMap, node: FieldNode): void {
  if (!node.selectionSet) return;

  const selections = [...node.selectionSet.selections];

  for (let i = selections.length - 1; i >= 0; i -= 1) {
    if (getKind(selections[i]) === FRAGMENT_SPREAD) {
      const fragmentSpread = selections[i] as FragmentSpreadNode;
      const name = getName(fragmentSpread);
      if (!name) continue;

      const { selectionSet } = fragmentDefinitions[name];
      if (!selectionSet) continue;

      selections.splice(i, 1, ...selectionSet.selections);
    }
  }

  node.selectionSet.selections = selections;
}
