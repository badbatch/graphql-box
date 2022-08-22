import { FragmentDefinitionNodeMap } from "@graphql-box/core";
import {
  FieldNode,
  FragmentDefinitionNode,
  FragmentSpreadNode,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLOutputType,
  GraphQLUnionType,
  InlineFragmentNode,
  NamedTypeNode,
  SelectionNode,
} from "graphql";
import { FIELD, FRAGMENT_SPREAD, INLINE_FRAGMENT } from "../../consts";
import { FieldAndTypeName, ParsedDirective } from "../../defs";
import { getInlineFragmentDirectives } from "../directives";
import { setFragmentDefinitions } from "../fragment-definitions";
import { getFragmentSpreadsWithoutDirectives, hasFragmentSpreads } from "../fragment-spreads";
import { getInlineFragments, hasInlineFragments, setInlineFragments } from "../inline-fragments";
import { isKind } from "../kind";
import { getName } from "../name";

export const resolveFragments = (
  selectionNodes: ReadonlyArray<SelectionNode>,
  fragmentDefinitions: FragmentDefinitionNodeMap = {},
  typeName?: string,
  fragmentKind?: string,
  fragmentName?: string,
): FieldAndTypeName[] => {
  let fieldAndTypeName: FieldAndTypeName[] = [];

  for (const selectionNode of selectionNodes) {
    if (isKind<FieldNode>(selectionNode, FIELD)) {
      fieldAndTypeName.push({ fieldNode: selectionNode, fragmentKind, fragmentName, typeName });
    } else if (isKind<FragmentSpreadNode>(selectionNode, FRAGMENT_SPREAD)) {
      const name = getName(selectionNode) as FragmentSpreadNode["name"]["value"];
      const fragmentDefinition = fragmentDefinitions[name];

      if (fragmentDefinition) {
        const fragmentDefinitionTypeName = getName(fragmentDefinition.typeCondition) as NamedTypeNode["name"]["value"];

        const resolvedFieldAndTypeName = resolveFragments(
          fragmentDefinition.selectionSet.selections,
          fragmentDefinitions,
          fragmentDefinitionTypeName,
          FRAGMENT_SPREAD,
          name,
        );

        fieldAndTypeName = fieldAndTypeName.concat(resolvedFieldAndTypeName);
      }
    } else if (isKind<InlineFragmentNode>(selectionNode, INLINE_FRAGMENT)) {
      const inlineFragmentTypeName = selectionNode.typeCondition
        ? (getName(selectionNode.typeCondition) as NamedTypeNode["name"]["value"])
        : undefined;

      const resolvedFieldAndTypeName = resolveFragments(
        selectionNode.selectionSet.selections,
        fragmentDefinitions,
        inlineFragmentTypeName,
        INLINE_FRAGMENT,
      );

      fieldAndTypeName = fieldAndTypeName.concat(resolvedFieldAndTypeName);
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

    const parsedInlineFragmentDirectives = inlineFragments.reduce((directives: ParsedDirective[], inlineFragment) => {
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

    if (fragmentSpreadsWithoutDirectives.length) {
      const count = setFragmentDefinitions(fragmentDefinitions, node, {
        include: fragmentSpreadsWithoutDirectives.map(spread => getName(spread) as FragmentSpreadNode["name"]["value"]),
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
