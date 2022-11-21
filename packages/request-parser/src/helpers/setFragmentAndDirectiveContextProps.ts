import { RequestOptions } from "@graphql-box/core";
import { ParsedDirective, getFragmentSpreadDirectives } from "@graphql-box/helpers";
import { FieldNode, FragmentDefinitionNode, InlineFragmentNode } from "graphql";
import { isEmpty } from "lodash";
import { Ancestors, VisitorContext } from "../defs";
import groupFragmentSpreadDirectives from "./groupFragmentSpreadDirectives";
import hasActiveDeferOrStreamDirective from "./hasActiveDeferOrStreamDirective";
import updatePersistedFragmentSpreads from "./updatePersistedFragmentSpreads";

export default (
  node: FieldNode | InlineFragmentNode | FragmentDefinitionNode,
  ancestors: Ancestors,
  options: RequestOptions,
  context: VisitorContext,
  parsedDirectives: ParsedDirective[] = [],
) => {
  const parsedFragmentSpreadDirectives = getFragmentSpreadDirectives(node, options);
  const groupedFragmentSpreadDirectives = groupFragmentSpreadDirectives(parsedFragmentSpreadDirectives);

  if (!isEmpty(groupedFragmentSpreadDirectives)) {
    updatePersistedFragmentSpreads(groupedFragmentSpreadDirectives, ancestors, context);
  }

  const hasDeferOrStream = hasActiveDeferOrStreamDirective([...parsedDirectives, ...parsedFragmentSpreadDirectives]);

  if (hasDeferOrStream) {
    context.hasDeferOrStream = true;

    if (!context.experimentalDeferStreamSupport) {
      throw new Error(
        "@graphql-box/request-parser >> to use defer/stream directives, please set the experimentalDeferStreamSupport flag to true",
      );
    }
  }
};
