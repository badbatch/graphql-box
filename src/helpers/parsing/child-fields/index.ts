import { FieldNode, InlineFragmentNode } from "graphql";
import { castArray, isArray } from "lodash";
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

export function deleteChildFields(node: ParentNode, fields: FieldNode[] | FieldNode): void {
  if (!node.selectionSet) return;
  const _fields = castArray(fields);
  const childFields = node.selectionSet.selections;

  for (let i = childFields.length - 1; i >= 0; i -= 1) {
    if (getKind(childFields[i]) === "InlineFragment") {
      const inlineFragmentNode = childFields[i] as InlineFragmentNode;
      deleteChildFields(inlineFragmentNode, _fields);
    } else if (getKind(childFields[i]) === "Field") {
      const fieldNode = childFields[i] as FieldNode;

      if (_fields.some((field) => field === fieldNode)) {
        childFields.splice(i, 1);
      }
    }
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
