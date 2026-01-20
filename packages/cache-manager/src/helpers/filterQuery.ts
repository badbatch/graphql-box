import { type FieldPaths } from '@graphql-box/core';
import { isKind } from '@graphql-box/helpers';
import {
  type DocumentNode,
  type FieldNode,
  type InlineFragmentNode,
  Kind,
  type OperationDefinitionNode,
  visit,
} from 'graphql';
import { buildOperationPathCacheKey } from '#helpers/buildOperationPathCacheKey.ts';

export const filterQuery = (ast: DocumentNode, resolvedPaths: string[], fieldPaths: FieldPaths): DocumentNode => {
  const fieldPathStack: string[] = [];

  return visit(ast, {
    enter: node => {
      if (isKind<FieldNode>(node, Kind.FIELD)) {
        fieldPathStack.push(node.name.value);
        const operationPath = fieldPathStack.join('.');
        const operationPathCacheKey = buildOperationPathCacheKey(operationPath, fieldPaths);

        if (resolvedPaths.includes(operationPathCacheKey)) {
          return null;
        }
      }

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
