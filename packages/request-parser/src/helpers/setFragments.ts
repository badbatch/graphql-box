import {
  ParsedDirective,
  getInlineFragmentDirectives,
  getInlineFragments,
  getName,
  hasFragmentSpreads,
  hasInlineFragments,
  setFragmentDefinitions,
  setInlineFragments,
} from "@graphql-box/helpers";
import {
  FieldNode,
  FragmentDefinitionNode,
  FragmentSpreadNode,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLOutputType,
  GraphQLUnionType,
  InlineFragmentNode,
} from "graphql";
import { FragmentDefinitionNodeMap } from "..";
import getFragmentSpreadsWithoutDirectives from "./getFragmentSpreadsWithoutDirectives";

export type Params = {
  fragmentDefinitions: FragmentDefinitionNodeMap | undefined;
  node: FieldNode | InlineFragmentNode | FragmentDefinitionNode;
  type: GraphQLOutputType | GraphQLNamedType;
};

const setFragments = ({ fragmentDefinitions, node, type }: Params) => {
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

export default setFragments;
