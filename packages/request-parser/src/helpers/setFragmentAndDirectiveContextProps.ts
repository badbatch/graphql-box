import { RequestOptions } from "@graphql-box/core";
import { ParsedDirective, getFragmentSpreadDirectives } from "@graphql-box/helpers";
import { FieldNode, FragmentDefinitionNode, InlineFragmentNode } from "graphql";
import { cloneDeep, isEmpty, keys } from "lodash";
import { Ancestors, PersistedFragmentSpread, VisitorContext } from "../defs";
import enrichAncestors from "./enrichAncestors";
import hasActiveDeferOrStreamDirective from "./hasActiveDeferOrStreamDirective";

export default (
  node: FieldNode | InlineFragmentNode | FragmentDefinitionNode,
  { ancestors, key }: Ancestors,
  options: RequestOptions,
  context: VisitorContext,
  parsedDirectives: ParsedDirective[] = [],
) => {
  const parsedFragmentSpreadDirectives = getFragmentSpreadDirectives(node, options);

  const groupedFragmentSpreadDirectives = parsedFragmentSpreadDirectives.reduce(
    (acc: { [key: string]: ParsedDirective[] }, { parentName, ...rest }) => {
      if (!acc[parentName]) {
        acc[parentName] = [];
      }

      acc[parentName].push({ parentName, ...rest });
      return acc;
    },
    {},
  );

  if (!isEmpty(groupedFragmentSpreadDirectives)) {
    context.persistedFragmentSpreads = [
      ...context.persistedFragmentSpreads,
      ...(keys(groupedFragmentSpreadDirectives).map(propName => [
        propName,
        groupedFragmentSpreadDirectives[propName],
        enrichAncestors(cloneDeep(ancestors), key as number),
      ]) as PersistedFragmentSpread[]),
    ];
  }

  const hasDeferOrStream = hasActiveDeferOrStreamDirective([...parsedDirectives, ...parsedFragmentSpreadDirectives]);

  if (hasDeferOrStream) {
    context.hasDeferOrStream = true;
  }
};
