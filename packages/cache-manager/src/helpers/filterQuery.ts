import { type FragmentDefinitionNodeMap } from '@graphql-box/core';
import {
  buildAncestorFieldNames,
  buildFieldOperationPath,
  getAlias,
  getFragmentDefinitions,
  isKind,
} from '@graphql-box/helpers';
import {
  type DocumentNode,
  type FieldNode,
  type FragmentDefinitionNode,
  type FragmentSpreadNode,
  type InlineFragmentNode,
  Kind,
  type OperationDefinitionNode,
  visit,
} from 'graphql';
import { replaceFragmentSpreadsWithDefinitionFields } from '#helpers/replaceFragmentSpreadsWithDefinitionFields.ts';

const childIsFragmentSpread = (node: FieldNode | InlineFragmentNode | FragmentDefinitionNode): boolean =>
  node.selectionSet?.selections.some(n => isKind<FragmentSpreadNode>(n, Kind.FRAGMENT_SPREAD)) ?? false;

export const filterQuery = (ast: DocumentNode, resolvedPaths: string[]): DocumentNode => {
  const fragmentDefinitions: FragmentDefinitionNodeMap = {
    ...getFragmentDefinitions(ast),
  };

  for (const [name, fragmentDefinition] of Object.entries(fragmentDefinitions)) {
    fragmentDefinitions[name] = replaceFragmentSpreadsWithDefinitionFields(fragmentDefinition, fragmentDefinitions);
  }

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

      if (
        (isKind<FieldNode>(node, Kind.FIELD) || isKind<InlineFragmentNode>(node, Kind.INLINE_FRAGMENT)) &&
        node.selectionSet &&
        childIsFragmentSpread(node)
      ) {
        return replaceFragmentSpreadsWithDefinitionFields(node, fragmentDefinitions);
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

      if (isKind<FragmentDefinitionNode>(node, Kind.FRAGMENT_DEFINITION)) {
        return null;
      }

      return;
    },
  });
};
