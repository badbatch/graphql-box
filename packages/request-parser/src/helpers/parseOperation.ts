import { type PlainObject } from '@graphql-box/core';
import { isAncestorAstNode, isKind } from '@graphql-box/helpers';
import {
  type DocumentNode,
  type FieldNode,
  type FragmentDefinitionNode,
  type FragmentSpreadNode,
  type GraphQLSchema,
  type InlineFragmentNode,
  Kind,
  type VariableDefinitionNode,
  type VariableNode,
  visit,
} from 'graphql';
import { type Jsonifiable } from 'type-fest';
import { buildOperationHash } from '#helpers/buildOperationHash.ts';
import { getVariableTypeAndValues } from '#helpers/getVariableTypesAndValues.ts';
import { parseFragmentDefinitions } from '#helpers/parseFragmentDefinitions.ts';
import { replaceFragmentSpreadsWithDefinitionFields } from '#helpers/replaceFragmentSpreadsWithDefinitionFields.ts';
import { replaceVariableNodeWithValueNode } from '#helpers/replaceVariableNodeWithValueNode.ts';

const childIsFragmentSpread = (node: FieldNode | InlineFragmentNode): boolean =>
  node.selectionSet?.selections.some(n => isKind<FragmentSpreadNode>(n, Kind.FRAGMENT_SPREAD)) ?? false;

const parsedOperationCache: Record<string, DocumentNode> = {};

export type ParseOperationOptions = {
  query: string;
  variables?: PlainObject<Jsonifiable>;
};

export const parseOperation = (
  ast: DocumentNode,
  schema: GraphQLSchema,
  { query, variables }: ParseOperationOptions,
): DocumentNode => {
  const operationHash = buildOperationHash(query, variables);

  if (parsedOperationCache[operationHash]) {
    return parsedOperationCache[operationHash];
  }

  const { variableTypes, variableValues } = getVariableTypeAndValues(ast, schema, variables);
  const fragmentDefinitions = parseFragmentDefinitions(ast, variableTypes, variableValues);

  const visitedAst = visit(ast, {
    enter: (node, _key, parent) => {
      if (
        (isKind<FieldNode>(node, Kind.FIELD) || isKind<InlineFragmentNode>(node, Kind.INLINE_FRAGMENT)) &&
        node.selectionSet &&
        childIsFragmentSpread(node)
      ) {
        return replaceFragmentSpreadsWithDefinitionFields(node, fragmentDefinitions, variableTypes, variableValues);
      }

      if (isKind<VariableNode>(node, Kind.VARIABLE)) {
        if (isAncestorAstNode(parent) && isKind<VariableDefinitionNode>(parent, Kind.VARIABLE_DEFINITION)) {
          // If the VariableNode is within a VariableDefinitionNode we want to return
          // because we don't want to replace this node. We will delete the entire
          // VariableDefinitionNode when the visitor exists that node.
          return;
        }

        const variableName = node.name.value;
        return replaceVariableNodeWithValueNode(variableTypes[variableName], variableValues[variableName]);
      }

      return;
    },
    leave: node => {
      if (isKind<FragmentDefinitionNode>(node, Kind.FRAGMENT_DEFINITION)) {
        return null;
      }

      if (isKind<VariableDefinitionNode>(node, Kind.VARIABLE_DEFINITION)) {
        return null;
      }

      return;
    },
  });

  parsedOperationCache[operationHash] = visitedAst;
  return visitedAst;
};
