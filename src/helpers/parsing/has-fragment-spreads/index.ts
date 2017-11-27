import { FieldNode } from "graphql";
import getKind from "../get-kind";

export default function hasFragmentSpreads({ selectionSet }: FieldNode): boolean {
  if (!selectionSet) return false;
  const { selections } = selectionSet;
  return selections.some((value) => getKind(value) === "FragmentSpread");
}
