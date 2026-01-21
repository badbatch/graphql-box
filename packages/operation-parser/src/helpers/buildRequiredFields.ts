import { type FieldPathMetadataRequiredFields } from '@graphql-box/core';
import { hasArguments, isKind } from '@graphql-box/helpers';
import {
  type FieldNode,
  type GraphQLSchema,
  type InlineFragmentNode,
  Kind,
  isInterfaceType,
  isObjectType,
  isUnionType,
} from 'graphql';
import { isListType } from 'graphql';

export const buildRequiredFields = (
  node: FieldNode | InlineFragmentNode,
  typeName: string,
  schema: GraphQLSchema,
): FieldPathMetadataRequiredFields => {
  const requiredFields: FieldPathMetadataRequiredFields = { __typename: new Set() };

  if (!node.selectionSet) {
    return requiredFields;
  }

  let resolvedTypeName: string = typeName;
  let resolvedTypeNameKey = '__typename';

  if (isKind<InlineFragmentNode>(node, Kind.INLINE_FRAGMENT) && node.typeCondition) {
    resolvedTypeName = node.typeCondition.name.value;
    resolvedTypeNameKey = node.typeCondition.name.value;
  }

  const parentType = schema.getType(resolvedTypeName);

  if (!parentType) {
    return requiredFields;
  }

  const handleInlineFragments = (inlineFragmentNode: InlineFragmentNode) => {
    const inlineFragmentRequiredFields = buildRequiredFields(inlineFragmentNode, typeName, schema);

    for (const [key, fieldNames] of Object.entries(inlineFragmentRequiredFields)) {
      const fields = (requiredFields[key] ??= new Set());

      for (const fieldName of fieldNames) {
        fields.add(fieldName);
      }
    }
  };

  if (isObjectType(parentType) || isInterfaceType(parentType)) {
    const fieldsMap = parentType.getFields();

    for (const selection of node.selectionSet.selections) {
      if (isKind<FieldNode>(selection, Kind.FIELD)) {
        const fieldDef = fieldsMap[selection.name.value];

        if (isListType(fieldDef?.type) || hasArguments(selection)) {
          continue;
        }

        const fields = (requiredFields[resolvedTypeNameKey] ??= new Set());
        fields.add(selection.name.value);
      }

      if (isKind<InlineFragmentNode>(selection, Kind.INLINE_FRAGMENT)) {
        handleInlineFragments(selection);
      }
    }
  } else if (isUnionType(parentType)) {
    for (const selection of node.selectionSet.selections) {
      if (isKind<FieldNode>(selection, Kind.FIELD)) {
        // The only fields that can be on a union at this point in
        // the workflow is the '__typename' field.
        const fields = (requiredFields[resolvedTypeNameKey] ??= new Set());
        fields.add(selection.name.value);
      }

      if (isKind<InlineFragmentNode>(selection, Kind.INLINE_FRAGMENT)) {
        handleInlineFragments(selection);
      }
    }
  }

  return requiredFields;
};
