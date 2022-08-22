import { FragmentDefinitionNodeMap, PlainObjectMap } from "@graphql-box/core";
import { FieldNode, GraphQLInterfaceType, GraphQLObjectType, GraphQLSchema, InlineFragmentNode } from "graphql";
import { castArray, isArray } from "lodash";
import { FIELD, INLINE_FRAGMENT } from "../../consts";
import { FieldAndTypeName, ParentNode } from "../../defs";
import { resolveFragments } from "../fragments";
import { getKind, isKind } from "../kind";
import { getName } from "../name";

export function addChildField(node: ParentNode, field: FieldNode, schema: GraphQLSchema, typeIDKey: string): void {
  if (!node.selectionSet) {
    return;
  }

  const childFields = [...node.selectionSet.selections];
  let added = false;

  for (const childField of childFields) {
    if (isKind<InlineFragmentNode>(childField, INLINE_FRAGMENT)) {
      if (childField.typeCondition) {
        const name = getName(childField.typeCondition);

        if (name) {
          const type = schema.getType(name);

          if (type instanceof GraphQLObjectType || type instanceof GraphQLInterfaceType) {
            const fields = type.getFields();

            if (fields[typeIDKey]) {
              addChildField(childField, field, schema, typeIDKey);
              added = true;
            }
          }
        }
      }
    }
  }

  if (added) {
    return;
  }

  childFields.push(field);
  node.selectionSet.selections = childFields;
}

export function deleteChildFields(node: ParentNode, fields: FieldNode[] | FieldNode): void {
  if (!node.selectionSet) {
    return;
  }

  const castFields = castArray(fields);
  const childFields = [...node.selectionSet.selections];

  for (let i = childFields.length - 1; i >= 0; i -= 1) {
    const childField = childFields[i];

    if (isKind<InlineFragmentNode>(childField, INLINE_FRAGMENT)) {
      deleteChildFields(childField, castFields);
    } else if (isKind<FieldNode>(childField, FIELD)) {
      if (castFields.some(field => field === childField)) {
        childFields.splice(i, 1);
      }
    }
  }

  node.selectionSet.selections = childFields;
}

export type ChildFieldOptions = {
  fragmentDefinitions?: FragmentDefinitionNodeMap;
  name?: string;
};

export function getChildFields(
  node: ParentNode,
  { fragmentDefinitions, name }: ChildFieldOptions = {},
): FieldAndTypeName[] | undefined {
  if (!node.selectionSet) {
    return undefined;
  }

  const fieldsAndTypeNames = resolveFragments(node.selectionSet.selections, fragmentDefinitions);

  if (!name) {
    return fieldsAndTypeNames;
  }

  const filtered = fieldsAndTypeNames.filter(
    ({ fieldNode }) => getName(fieldNode) === name || getKind(fieldNode) === name,
  );

  return filtered;
}

export function hasChildFields(node: ParentNode, { fragmentDefinitions, name }: ChildFieldOptions = {}): boolean {
  if (!node.selectionSet) {
    return false;
  }

  const fieldsAndTypeNames = resolveFragments(node.selectionSet.selections, fragmentDefinitions);

  if (!name) {
    return !!fieldsAndTypeNames.length;
  }

  return fieldsAndTypeNames.some(({ fieldNode }) => getName(fieldNode) === name || getKind(fieldNode) === name);
}

export function iterateChildFields(
  field: FieldNode,
  data: PlainObjectMap | any[],
  fragmentDefinitions: FragmentDefinitionNodeMap | undefined,
  callback: (
    childField: FieldNode,
    typeName: string | undefined,
    fragmentKind: string | undefined,
    fragmentName: string | undefined,
    childIndex?: number,
  ) => void,
): void {
  if (!isArray(data)) {
    const fieldsAndTypeNames = getChildFields(field, { fragmentDefinitions });

    if (!fieldsAndTypeNames) {
      return;
    }

    fieldsAndTypeNames.forEach(({ fieldNode, fragmentKind, fragmentName, typeName }) => {
      callback(fieldNode, typeName, fragmentKind, fragmentName);
    });
  } else {
    data.forEach((_value, index) => {
      callback(field, undefined, undefined, undefined, index);
    });
  }
}
