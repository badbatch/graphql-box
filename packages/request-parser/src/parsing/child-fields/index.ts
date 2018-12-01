import { FieldNode, GraphQLInterfaceType, GraphQLObjectType, GraphQLSchema, InlineFragmentNode } from "graphql";
import { castArray } from "lodash";
import { FIELD, INLINE_FRAGMENT } from "../../consts";
import * as defs from "../../defs";
import { unwrapInlineFragments } from "../inline-fragments";
import { getKind } from "../kind";
import { getName } from "../name";

export function addChildField(
  node: defs.ParentNode,
  field: FieldNode,
  schema: GraphQLSchema,
  resourceID: string,
): void {
  if (!node.selectionSet) return;

  const childFields = [...node.selectionSet.selections];
  let added = false;

  for (const childField of childFields) {
    if (getKind(childField) === INLINE_FRAGMENT) {
      const inlineFragmentNode = childField as InlineFragmentNode;

      if (inlineFragmentNode.typeCondition) {
        const name = getName(inlineFragmentNode.typeCondition);

        if (name) {
          const type = schema.getType(name);

          if (type instanceof GraphQLObjectType || type instanceof GraphQLInterfaceType) {
            const fields = type.getFields();

            if (fields[resourceID]) {
              addChildField(inlineFragmentNode, field, schema, resourceID);
              added = true;
            }
          }
        }
      }
    }
  }

  if (added) return;

  childFields.push(field);
  node.selectionSet.selections = childFields;
}

export function deleteChildFields(node: defs.ParentNode, fields: FieldNode[] | FieldNode): void {
  if (!node.selectionSet) return;

  const _fields = castArray(fields);
  const childFields = [...node.selectionSet.selections];

  for (let i = childFields.length - 1; i >= 0; i -= 1) {
    if (getKind(childFields[i]) === INLINE_FRAGMENT) {
      const inlineFragmentNode = childFields[i] as InlineFragmentNode;
      deleteChildFields(inlineFragmentNode, _fields);
    } else if (getKind(childFields[i]) === FIELD) {
      const fieldNode = childFields[i] as FieldNode;

      if (_fields.some((field) => field === fieldNode)) {
        childFields.splice(i, 1);
      }
    }
  }

  node.selectionSet.selections = childFields;
}

export type GetChildFieldsResults = FieldNode[] | FieldNode | undefined;

export function getChildFields(node: defs.ParentNode, name?: string): GetChildFieldsResults {
  if (!node.selectionSet) return undefined;

  const childFields = unwrapInlineFragments(node.selectionSet.selections);
  if (!name) return childFields;

  return childFields.find((field) => getName(field) === name || getKind(field) === name);
}

export function hasChildFields(node: defs.ParentNode, name?: string): boolean {
  if (!node.selectionSet) return false;

  const childFields = unwrapInlineFragments(node.selectionSet.selections);
  if (!name) return !!childFields.length;

  return childFields.some((field) => getName(field) === name || getKind(field) === name);
}
