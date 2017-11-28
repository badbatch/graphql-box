import { FieldNode } from "graphql";
import { isArray } from "lodash";
import { unwrapInlineFragments } from "../inline-fragments";
import { getKind } from "../kind";
import { getName } from "../name";
import { ParentNode } from "../types";

export function addChildFields(node: ParentNode, fields: FieldNode[] | FieldNode): void {
  if (!node.selectionSet) return;
  let selections = node.selectionSet.selections;

  if (isArray(fields)) {
    selections = [...selections, ...fields];
  } else {
    selections.push(fields);
  }
}

export type GetChildFieldsResults = FieldNode[] | FieldNode | void;

export function getChildFields(node: ParentNode, name?: string): GetChildFieldsResults {
  if (!node.selectionSet) return;
  const childFields = unwrapInlineFragments(node.selectionSet.selections);
  if (!name) return childFields;
  return childFields.find((field) => getName(field) === name || getKind(field) === name);
}

export function hasChildFields(node: ParentNode, name?: string): boolean {
  if (!node.selectionSet) return false;
  const childFields = unwrapInlineFragments(node.selectionSet.selections);
  if (!name) return !!childFields.length;
  return childFields.some((field) => getName(field) === name || getKind(field) === name);
}
