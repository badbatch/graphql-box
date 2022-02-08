import { getFragmentSpreads } from "@graphql-box/helpers";
import { FieldNode, FragmentDefinitionNode, FragmentSpreadNode, InlineFragmentNode } from "graphql";

export default (node: FieldNode | InlineFragmentNode | FragmentDefinitionNode) => {
  const fragmentSpreads = getFragmentSpreads(node);

  return fragmentSpreads.reduce((withoutDirectives: FragmentSpreadNode[], spread) => {
    if (!spread.directives?.length) {
      withoutDirectives.push(spread);
    }

    return withoutDirectives;
  }, []);
};
