import unwrapInlineFragments from "../inline-fragments/unwrap";
import getKind from "../kind/get";
import getName from "../name/get";
import { ParentNode } from "../types";

export default function hasChildFields(node: ParentNode, name?: string): boolean {
  if (!node.selectionSet) return false;
  const childFields = unwrapInlineFragments(node.selectionSet.selections);
  if (!name) return !!childFields.length;
  return childFields.some((field) => getName(field) === name || getKind(field) === name);
}
