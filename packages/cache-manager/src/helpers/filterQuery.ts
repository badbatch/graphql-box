import { buildAncestorFieldNames, buildFieldOperationPath, getAlias, isKind } from '@graphql-box/helpers';
import {
  type DocumentNode,
  type FieldNode,
  type InlineFragmentNode,
  Kind,
  type OperationDefinitionNode,
  visit,
} from 'graphql';

export const filterQuery = (ast: DocumentNode, resolvedPaths: string[]): DocumentNode => {
  return visit(ast, {
    enter: (node, _key, _parent, _path, ancestors) => {
      if (isKind<FieldNode>(node, Kind.FIELD)) {
        const ancestorFieldNames = buildAncestorFieldNames(ancestors);
        const parentFieldPath = ancestorFieldNames.join('.');
        const fieldName = getAlias(node) ?? node.name.value;
        const fieldOperationPath = buildFieldOperationPath(fieldName, parentFieldPath);

        if (resolvedPaths.includes(fieldOperationPath)) {
          return null;
        }
      }

      return;
    },
    leave: node => {
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
