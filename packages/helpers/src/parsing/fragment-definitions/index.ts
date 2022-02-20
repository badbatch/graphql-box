import { DocumentNode, FieldNode, FragmentDefinitionNode, FragmentSpreadNode, InlineFragmentNode } from "graphql";
import { isEmpty } from "lodash";
import { FRAGMENT_DEFINITION, FRAGMENT_SPREAD } from "../../consts";
import { FragmentDefinitionNodeMap } from "../../defs";
import { isKind } from "../kind";
import { getName } from "../name";

export function deleteFragmentDefinitions(
  documentNode: DocumentNode,
  { exclude = [], include = [] }: { exclude?: string[]; include?: string[] } = {},
) {
  const definitions = [...documentNode.definitions];

  for (let i = definitions.length - 1; i >= 0; i -= 1) {
    const definitionNode = definitions[i];
    const isFragmentDefinition = isKind<FragmentDefinitionNode>(definitions[i], FRAGMENT_DEFINITION);

    if (!isFragmentDefinition) {
      continue;
    }

    const isIncluded =
      !!include.length && include.includes(getName(definitionNode) as FragmentDefinitionNode["name"]["value"]);

    const isExcluded =
      (include.length && !isIncluded) ||
      exclude.includes(getName(definitionNode) as FragmentDefinitionNode["name"]["value"]);

    if (isIncluded || !isExcluded) {
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
    if (isKind<FragmentDefinitionNode>(value, FRAGMENT_DEFINITION)) {
      const name = getName(value);

      if (!name) {
        return;
      }

      fragmentDefinitions[name] = value;
    }
  });

  if (isEmpty(fragmentDefinitions)) {
    return undefined;
  }

  return fragmentDefinitions;
}

export const setFragmentDefinitions = (
  fragmentDefinitions: FragmentDefinitionNodeMap,
  node: FieldNode | InlineFragmentNode | FragmentDefinitionNode,
  { exclude = [], include = [] }: { exclude?: string[]; include?: string[] } = {},
) => {
  let fragmentsSet = 0;

  if (!node.selectionSet) {
    return fragmentsSet;
  }

  const selections = [...node.selectionSet.selections];

  for (let i = selections.length - 1; i >= 0; i -= 1) {
    const selectionNode = selections[i];
    const isFragmentSpread = isKind<FragmentSpreadNode>(selectionNode, FRAGMENT_SPREAD);

    if (!isFragmentSpread) {
      continue;
    }

    const name = getName(selectionNode) as FragmentSpreadNode["name"]["value"];
    const isIncluded = !!include.length && include.includes(name);
    const isExcluded = (include.length && !isIncluded) || exclude.includes(name);

    if (isIncluded || !isExcluded) {
      const { selectionSet } = fragmentDefinitions[name];

      if (!selectionSet) {
        continue;
      }

      selections.splice(i, 1, ...selectionSet.selections);
      fragmentsSet += 1;
    }
  }

  node.selectionSet.selections = selections;
  return fragmentsSet;
};
