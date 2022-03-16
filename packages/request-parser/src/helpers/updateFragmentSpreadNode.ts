import { RequestOptions } from "@graphql-box/core";
import { getKind, getName, parseDirectiveArguments } from "@graphql-box/helpers";
import { FragmentSpreadNode } from "graphql";
import { isEmpty } from "lodash";
import { Ancestors, VisitorContext } from "../defs";
import groupFragmentSpreadDirectives from "./groupFragmentSpreadDirectives";
import hasActiveDeferOrStreamDirective from "./hasActiveDeferOrStreamDirective";
import updatePersistedFragmentSpreads from "./updatePersistedFragmentSpreads";

export default (node: FragmentSpreadNode, ancestors: Ancestors, options: RequestOptions, context: VisitorContext) => {
  if (!node.directives) {
    return;
  }

  const parsedDirectives = parseDirectiveArguments(
    node.directives,
    getName(node) as FragmentSpreadNode["name"]["value"],
    getKind(node),
    options,
  );

  const groupedFragmentSpreadDirectives = groupFragmentSpreadDirectives(parsedDirectives);

  if (!isEmpty(groupedFragmentSpreadDirectives)) {
    updatePersistedFragmentSpreads(groupedFragmentSpreadDirectives, ancestors, context);
  }

  const hasDeferOrStream = hasActiveDeferOrStreamDirective(parsedDirectives);

  if (hasDeferOrStream) {
    context.hasDeferOrStream = true;
  }
};
