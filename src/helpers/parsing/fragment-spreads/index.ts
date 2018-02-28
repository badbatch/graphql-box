import { FieldNode } from "graphql";
import { getKind } from "../kind";

export function hasFragmentSpreads({ selectionSet }: FieldNode): boolean {
  if (!selectionSet) return false;
  const { selections } = selectionSet;
  return selections.some((value) => getKind(value) === "FragmentSpread");
}
