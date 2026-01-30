import { type PlainObject } from '@graphql-box/core';
import { getFragmentDefinitions, isAncestorAstNode, isKind } from '@graphql-box/helpers';
import {
  type ArgumentNode,
  type DirectiveNode,
  type DocumentNode,
  type FieldNode,
  type FragmentDefinitionNode,
  type FragmentSpreadNode,
  type GraphQLSchema,
  type InlineFragmentNode,
  Kind,
  type OperationDefinitionNode,
  type VariableDefinitionNode,
  type VariableNode,
  visit,
} from 'graphql';
import { TypeInfo, visitWithTypeInfo } from 'graphql';
import { directivesHasIncludeFalseOrSkipTrue } from '#helpers/directivesHasIncludeFalseOrSkipTrue.ts';
import { normaliseVariables } from '#helpers/normaliseVariables.ts';
import { replaceFragmentSpreadsWithDefinitionFields } from '#helpers/replaceFragmentSpreadsWithDefinitionFields.ts';
import { replaceVariableNodeWithValueNode } from '#helpers/replaceVariableNodeWithValueNode.ts';
import { sortSelections } from '#helpers/sortSelections.ts';

const childIsFragmentSpread = (node: FieldNode | InlineFragmentNode): boolean =>
  node.selectionSet?.selections.some(n => isKind<FragmentSpreadNode>(n, Kind.FRAGMENT_SPREAD)) ?? false;

// const parsedOperationCache: Record<string, DocumentNode> = {};

export type ParseOperationOptions = {
  operation: string;
  variables?: PlainObject<unknown>;
};

export const normaliseOperation = (
  ast: DocumentNode,
  schema: GraphQLSchema,
  { variables }: ParseOperationOptions,
): DocumentNode => {
  // const operationHash = buildOperationHash(operation, variables);

  // if (parsedOperationCache[operationHash]) {
  //   return parsedOperationCache[operationHash];
  // }

  const typeInfo = new TypeInfo(schema);
  const fragmentDefinitions = getFragmentDefinitions(ast);
  const normalisedVariables = normaliseVariables(ast, schema, variables);

  const visitedAst = visit(
    ast,
    visitWithTypeInfo(typeInfo, {
      enter: (node, _key, parent) => {
        if (
          (isKind<FieldNode>(node, Kind.FIELD) || isKind<InlineFragmentNode>(node, Kind.INLINE_FRAGMENT)) &&
          directivesHasIncludeFalseOrSkipTrue(node, normalisedVariables)
        ) {
          return null;
        }

        if (
          (isKind<FieldNode>(node, Kind.FIELD) || isKind<InlineFragmentNode>(node, Kind.INLINE_FRAGMENT)) &&
          node.selectionSet &&
          childIsFragmentSpread(node)
        ) {
          return replaceFragmentSpreadsWithDefinitionFields(node, fragmentDefinitions, normalisedVariables);
        }

        if (isKind<VariableNode>(node, Kind.VARIABLE)) {
          if (isAncestorAstNode(parent) && isKind<VariableDefinitionNode>(parent, Kind.VARIABLE_DEFINITION)) {
            // If the VariableNode is within a VariableDefinitionNode we want to return
            // because we don't want to replace this node. We will delete the entire
            // VariableDefinitionNode when the visitor exists that node.
            return;
          }

          const variableName = node.name.value;
          const normalisedVariable = normalisedVariables[variableName];

          if (!normalisedVariable) {
            throw new Error(`${variableName} has an unknown variable type`);
          }

          if (normalisedVariable.value === undefined && normalisedVariable.required) {
            throw new Error(`No value provided for required variable "${variableName}"`);
          }

          if (normalisedVariable.value !== undefined) {
            return replaceVariableNodeWithValueNode(normalisedVariable.type, normalisedVariable.value);
          }

          if (!normalisedVariable.required) {
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
          node.selectionSet
        ) {
          node.selectionSet.selections = sortSelections(node.selectionSet.selections);
        }

        if (isKind<FragmentDefinitionNode>(node, Kind.FRAGMENT_DEFINITION)) {
          return null;
        }

        if (isKind<VariableDefinitionNode>(node, Kind.VARIABLE_DEFINITION)) {
          return null;
        }

        // We are setting variable nodes to null to indicate which to remove
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (isKind<ArgumentNode>(node, Kind.ARGUMENT) && node.value === null) {
          return null;
        }

        if (
          isKind<DirectiveNode>(node, Kind.DIRECTIVE) &&
          (node.name.value === 'include' || node.name.value === 'skip')
        ) {
          return null;
        }

        return;
      },
    }),
  );

  // parsedOperationCache[operationHash] = visitedAst;
  return visitedAst;
};
