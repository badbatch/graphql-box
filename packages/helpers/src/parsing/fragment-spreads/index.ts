import { FieldNode, InlineFragmentNode } from "graphql";
import { FRAGMENT_SPREAD } from "../../consts";
import { getKind } from "../kind";

export function hasFragmentSpreads({ selectionSet }: FieldNode | InlineFragmentNode): boolean {
  if (!selectionSet) return false;

  const { selections } = selectionSet;
  return selections.some(value => getKind(value) === FRAGMENT_SPREAD);
}
