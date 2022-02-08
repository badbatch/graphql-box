import { FieldNode, FragmentDefinitionNode, FragmentSpreadNode, InlineFragmentNode, SelectionSetNode } from "graphql";
import { FRAGMENT_SPREAD } from "../../consts";
import { isKind } from "../kind";
import { getName } from "../name";

export function hasFragmentSpreads({ selectionSet }: FieldNode | InlineFragmentNode | FragmentDefinitionNode): boolean {
  if (!selectionSet) return false;

  const { selections } = selectionSet;
  return selections.some(value => isKind<FragmentSpreadNode>(value, FRAGMENT_SPREAD));
}

export function getFragmentSpreads(
  fieldNode: FieldNode | InlineFragmentNode | FragmentDefinitionNode,
  { exclude = [], include = [] }: { exclude?: string[]; include?: string[] } = {},
) {
  if (!hasFragmentSpreads(fieldNode)) {
    return [];
  }

  return (fieldNode.selectionSet as SelectionSetNode).selections.filter(value => {
    const isFragmentSpread = isKind<FragmentSpreadNode>(value, FRAGMENT_SPREAD);

    if (!isFragmentSpread) {
      return false;
    }

    const isIncluded = !!include.length && include.includes(getName(value) as FragmentSpreadNode["name"]["value"]);

    const isExcluded =
      (include.length && !isIncluded) || exclude.includes(getName(value) as FragmentSpreadNode["name"]["value"]);

    return isIncluded || !isExcluded;
  }) as FragmentSpreadNode[];
}
