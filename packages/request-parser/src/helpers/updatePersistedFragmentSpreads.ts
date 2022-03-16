import { ParsedDirective } from "@graphql-box/helpers";
import { cloneDeep, isUndefined, keys } from "lodash";
import { Ancestors, PersistedFragmentSpread, VisitorContext } from "../defs";
import enrichAncestors from "./enrichAncestors";

export default (
  groupedFragmentSpreadDirectives: {
    [key: string]: ParsedDirective[];
  },
  { ancestors, key }: Ancestors,
  context: VisitorContext,
) => {
  context.persistedFragmentSpreads = [
    ...context.persistedFragmentSpreads,
    ...(keys(groupedFragmentSpreadDirectives).map(propName => [
      propName,
      groupedFragmentSpreadDirectives[propName],
      !isUndefined(key) ? enrichAncestors(cloneDeep(ancestors), key) : ancestors,
    ]) as PersistedFragmentSpread[]),
  ];
};
