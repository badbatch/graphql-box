import { FieldNode } from "graphql";
import unwrapInlineFragments from "../inline-fragments/unwrap";
import getKind from "../kind/get";
import getName from "../name/get";
import { ParentNode } from "../types";

export type GetChildFieldsResults = FieldNode[] | FieldNode | void;

export default function getChildFields(node: ParentNode, name?: string): GetChildFieldsResults {
  if (!node.selectionSet) return;
  const childFields = unwrapInlineFragments(node.selectionSet.selections);
  if (!name) return childFields;
  return childFields.find((field) => getName(field) === name || getKind(field) === name);
}
