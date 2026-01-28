import { type FieldPaths } from '@graphql-box/core';
import { buildOperationPathCacheKey, getAlias, isKind } from '@graphql-box/helpers';
import {
  type DocumentNode,
  type FieldNode,
  type InlineFragmentNode,
  Kind,
  type OperationDefinitionNode,
  type SelectionNode,
  visit,
} from 'graphql';

const removeSelectionsInRequiredFields = (
  readonlySelections: readonly SelectionNode[],
  requiredFields: string[] = [],
): readonly SelectionNode[] => {
  const selections: SelectionNode[] = [...readonlySelections];

  for (let i = selections.length - 1; i >= 0; i--) {
    // Typescript unable to infer `selection` cannot be undefined
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const selection = selections[i]!;

    if (
      isKind<FieldNode>(selection, Kind.FIELD) &&
      requiredFields.includes(getAlias(selection) ?? selection.name.value)
    ) {
      selections.splice(i, 1);
    }
  }

  return selections;
};

export const filterQuery = (ast: DocumentNode, resolvedPaths: string[], fieldPaths: FieldPaths): DocumentNode => {
  const fieldPathStack: string[] = [];

  return visit(ast, {
    enter: node => {
      if (!isKind<FieldNode>(node, Kind.FIELD) && !isKind<InlineFragmentNode>(node, Kind.INLINE_FRAGMENT)) {
        return;
      }

      if (isKind<FieldNode>(node, Kind.FIELD)) {
        fieldPathStack.push(getAlias(node) ?? node.name.value);
      }

      const operationPath = fieldPathStack.join('.');
      const fieldPathMetadata = fieldPaths[operationPath];

      // If there is no fieldPathMetadata for a operationPath
      // it means we are not interested in the operationPath
      // and can ignore it.
      if (!fieldPathMetadata) {
        return;
      }

      const operationPathCacheKey = buildOperationPathCacheKey(operationPath, fieldPaths);

      if (!resolvedPaths.includes(operationPathCacheKey)) {
        return;
      }

      const { isEntity, requiredFields } = fieldPathMetadata;

      if (!node.selectionSet || !isEntity || !requiredFields) {
        return null;
      }

      const typeName =
        isKind<InlineFragmentNode>(node, Kind.INLINE_FRAGMENT) && node.typeCondition
          ? node.typeCondition.name.value
          : '__typename';

      const selections = removeSelectionsInRequiredFields(node.selectionSet.selections, requiredFields[typeName]);

      if (selections.length === 0) {
        return null;
      }

      node.selectionSet.selections = selections;
      return;
    },
    leave: node => {
      if (isKind<FieldNode>(node, Kind.FIELD)) {
        fieldPathStack.pop();
      }

      if (
        (isKind<FieldNode>(node, Kind.FIELD) ||
          isKind<InlineFragmentNode>(node, Kind.INLINE_FRAGMENT) ||
          isKind<OperationDefinitionNode>(node, Kind.OPERATION_DEFINITION)) &&
        node.selectionSet?.selections.length === 0
      ) {
        return null;
      }

      return;
    },
  });
};
