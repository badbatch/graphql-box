import { type FragmentDefinitionNodeMap } from '@graphql-box/core';
import {
  type FieldNode,
  GraphQLInterfaceType,
  GraphQLObjectType,
  type GraphQLSchema,
  type InlineFragmentNode,
  Kind,
} from 'graphql';
import { castArray } from 'lodash-es';
import { isArray } from '../lodashProxies.ts';
import { type FieldAndTypeName, type ParentNode } from '../types.ts';
import { resolveFragments } from './fragments.ts';
import { getKind, isKind } from './kind.ts';
import { getName } from './name.ts';

export const addChildField = (node: ParentNode, field: FieldNode, schema: GraphQLSchema, typeIDKey: string): void => {
  if (!node.selectionSet) {
    return;
  }

  const childFields = [...node.selectionSet.selections];
  let added = false;

  for (const childField of childFields) {
    if (isKind<InlineFragmentNode>(childField, Kind.INLINE_FRAGMENT) && childField.typeCondition) {
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

  if (added) {
    return;
  }

  childFields.push(field);
  node.selectionSet.selections = childFields;
};

export const deleteChildFields = (node: ParentNode, fields: FieldNode[] | FieldNode): void => {
  if (!node.selectionSet) {
    return;
  }

  const castFields = castArray(fields);
  const childFields = [...node.selectionSet.selections];

  for (let index = childFields.length - 1; index >= 0; index -= 1) {
    // Based on context, childFields[index] cannot be undefined
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const childField = childFields[index]!;

    if (isKind<InlineFragmentNode>(childField, Kind.INLINE_FRAGMENT)) {
      deleteChildFields(childField, castFields);
    } else if (isKind<FieldNode>(childField, Kind.FIELD) && castFields.includes(childField)) {
      childFields.splice(index, 1);
    }
  }

  node.selectionSet.selections = childFields;
};

export type ChildFieldOptions = {
  fragmentDefinitions?: FragmentDefinitionNodeMap;
  name?: string;
};

export const getChildFields = (
  node: ParentNode,
  { fragmentDefinitions, name }: ChildFieldOptions = {},
): FieldAndTypeName[] | undefined => {
  if (!node.selectionSet) {
    return undefined;
  }

  const fieldsAndTypeNames = resolveFragments(node.selectionSet.selections, fragmentDefinitions);

  if (!name) {
    return fieldsAndTypeNames;
  }

  return fieldsAndTypeNames.filter(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    ({ fieldNode }) => getName(fieldNode) === name || getKind(fieldNode) === name,
  );
};

export const hasChildFields = (node: ParentNode, { fragmentDefinitions, name }: ChildFieldOptions = {}): boolean => {
  if (!node.selectionSet) {
    return false;
  }

  const fieldsAndTypeNames = resolveFragments(node.selectionSet.selections, fragmentDefinitions);

  if (!name) {
    return fieldsAndTypeNames.length > 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
  return fieldsAndTypeNames.some(({ fieldNode }) => getName(fieldNode) === name || getKind(fieldNode) === name);
};

export const iterateChildFields = (
  field: FieldNode,
  data: object,
  fragmentDefinitions: FragmentDefinitionNodeMap | undefined,
  callback: (
    childField: FieldNode,
    typeName: string | undefined,
    fragmentKind: string | undefined,
    fragmentName: string | undefined,
    childIndex?: number,
  ) => void,
): void => {
  if (isArray(data)) {
    for (const [index] of data.entries()) {
      callback(field, undefined, undefined, undefined, index);
    }
  } else {
    const fieldsAndTypeNames = getChildFields(field, { fragmentDefinitions });

    if (!fieldsAndTypeNames) {
      return;
    }

    for (const { fieldNode, fragmentKind, fragmentName, typeName } of fieldsAndTypeNames) {
      callback(fieldNode, typeName, fragmentKind, fragmentName);
    }
  }
};
