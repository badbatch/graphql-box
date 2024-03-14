import { type FragmentDefinitionNodeMap } from '@graphql-box/core';
import {
  type FieldNode,
  type FragmentDefinitionNode,
  type FragmentSpreadNode,
  GraphQLInterfaceType,
  type GraphQLNamedType,
  type GraphQLOutputType,
  GraphQLUnionType,
  type InlineFragmentNode,
  Kind,
  type SelectionNode,
} from 'graphql';
import { type FieldAndTypeName, type ParsedDirective } from '../types.ts';
import { getInlineFragmentDirectives } from './directives.ts';
import { setFragmentDefinitions } from './fragmentDefinitions.ts';
import { getFragmentSpreadsWithoutDirectives, hasFragmentSpreads } from './fragmentSpreads.ts';
import { getInlineFragments, hasInlineFragments, setInlineFragments } from './inlineFragments.ts';
import { isKind } from './kind.ts';
import { getName } from './name.ts';

export const resolveFragments = (
  selectionNodes: readonly SelectionNode[] = [],
  fragmentDefinitions: FragmentDefinitionNodeMap = {},
  typeName?: string,
  fragmentKind?: string,
  fragmentName?: string
): FieldAndTypeName[] => {
  let fieldAndTypeName: FieldAndTypeName[] = [];

  for (const selectionNode of selectionNodes) {
    if (isKind<FieldNode>(selectionNode, Kind.FIELD)) {
      fieldAndTypeName.push({ fieldNode: selectionNode, fragmentKind, fragmentName, typeName });
    } else if (isKind<FragmentSpreadNode>(selectionNode, Kind.FRAGMENT_SPREAD)) {
      const name = getName(selectionNode)!;
      const fragmentDefinition = fragmentDefinitions[name];

      if (fragmentDefinition) {
        const fragmentDefinitionTypeName = getName(fragmentDefinition.typeCondition)!;

        const resolvedFieldAndTypeName = resolveFragments(
          fragmentDefinition.selectionSet.selections,
          fragmentDefinitions,
          fragmentDefinitionTypeName,
          Kind.FRAGMENT_SPREAD,
          name
        );

        fieldAndTypeName = [...fieldAndTypeName, ...resolvedFieldAndTypeName];
      }
    } else if (isKind<InlineFragmentNode>(selectionNode, Kind.INLINE_FRAGMENT)) {
      const inlineFragmentTypeName = selectionNode.typeCondition ? getName(selectionNode.typeCondition)! : undefined;

      const resolvedFieldAndTypeName = resolveFragments(
        selectionNode.selectionSet.selections,
        fragmentDefinitions,
        inlineFragmentTypeName,
        Kind.INLINE_FRAGMENT
      );

      fieldAndTypeName = [...fieldAndTypeName, ...resolvedFieldAndTypeName];
    }
  }

  return fieldAndTypeName;
};

export type Params = {
  fragmentDefinitions: FragmentDefinitionNodeMap | undefined;
  node: FieldNode | InlineFragmentNode | FragmentDefinitionNode;
  type: GraphQLOutputType | GraphQLNamedType;
};

export const setFragments = ({ fragmentDefinitions, node, type }: Params) => {
  let fragmentsSet = false;

  if (!(type instanceof GraphQLInterfaceType) && !(type instanceof GraphQLUnionType) && hasInlineFragments(node)) {
    const inlineFragments = getInlineFragments(node);

    const parsedInlineFragmentDirectives = inlineFragments.reduce<ParsedDirective[]>((directives, inlineFragment) => {
      return [...directives, ...getInlineFragmentDirectives(inlineFragment)];
    }, []);

    const count = setInlineFragments(node, {
      exclude: parsedInlineFragmentDirectives.map(({ parentName }) => parentName),
    });

    if (count) {
      fragmentsSet = true;
    }
  }

  if (fragmentDefinitions && hasFragmentSpreads(node)) {
    const fragmentSpreadsWithoutDirectives = getFragmentSpreadsWithoutDirectives(node);

    if (fragmentSpreadsWithoutDirectives.length > 0) {
      const count = setFragmentDefinitions(fragmentDefinitions, node, {
        include: fragmentSpreadsWithoutDirectives.map(spread => getName(spread)!),
      });

      if (count) {
        fragmentsSet = true;
      }
    }
  }

  if (fragmentsSet) {
    setFragments({ fragmentDefinitions, node, type });
  }
};
