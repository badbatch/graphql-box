import { PlainObjectMap } from "@handl/core";
import { FieldNode, GraphQLInterfaceType, GraphQLObjectType, GraphQLSchema, InlineFragmentNode } from "graphql";
import { castArray, isArray } from "lodash";
import { FIELD, INLINE_FRAGMENT } from "../../consts";
import { FieldAndTypeName, ParentNode } from "../../defs";
import { unwrapInlineFragments } from "../inline-fragments";
import { getKind } from "../kind";
import { getName } from "../name";

export function addChildField(
  node: ParentNode,
  field: FieldNode,
  schema: GraphQLSchema,
  typeIDKey: string,
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

            if (fields[typeIDKey]) {
              addChildField(inlineFragmentNode, field, schema, typeIDKey);
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

export function deleteChildFields(node: ParentNode, fields: FieldNode[] | FieldNode): void {
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

export function getChildFields(node: ParentNode, name?: string): FieldAndTypeName[] | undefined {
  if (!node.selectionSet) return undefined;

  const fieldsAndTypeNames = unwrapInlineFragments(node.selectionSet.selections);
  if (!name) return fieldsAndTypeNames;

  const filtered = fieldsAndTypeNames.filter(({ fieldNode }) =>
    getName(fieldNode) === name || getKind(fieldNode) === name);

  return filtered;
}

export function hasChildFields(node: ParentNode, name?: string): boolean {
  if (!node.selectionSet) return false;

  const fieldsAndTypeNames = unwrapInlineFragments(node.selectionSet.selections);
  if (!name) return !!fieldsAndTypeNames.length;

  return fieldsAndTypeNames.some(({ fieldNode }) => getName(fieldNode) === name || getKind(fieldNode) === name);
}

export function iterateChildFields(
  field: FieldNode,
  data: PlainObjectMap | any[],
  callback: (childField: FieldNode, inlineFragmentType: string | undefined, childIndex?: number) => void,
): void {
  if (!isArray(data)) {
    const fieldsAndTypeNames = getChildFields(field);
    if (!fieldsAndTypeNames) return;

    fieldsAndTypeNames.forEach(({ fieldNode, typeName }) => {
      callback(fieldNode, typeName);
    });
  } else {
    data.forEach((value, index) => {
      callback(field, undefined, index);
    });
  }
}
