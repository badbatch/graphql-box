import { type ParsedDirective } from '@graphql-box/helpers';
import { isUndefined, keys } from 'lodash-es';
import { type Ancestors, type PersistedFragmentSpread, type VisitorContext } from '../types.ts';
import { enrichAncestors } from './enrichAncestors.ts';

export const updatePersistedFragmentSpreads = (
  groupedFragmentSpreadDirectives: Record<string, ParsedDirective[]>,
  { ancestors, key }: Ancestors,
  context: VisitorContext,
) => {
  context.persistedFragmentSpreads = [
    ...context.persistedFragmentSpreads,
    // Will need to revisit this
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    ...(keys(groupedFragmentSpreadDirectives).map(propName => [
      propName,
      groupedFragmentSpreadDirectives[propName],
      isUndefined(key) ? ancestors : enrichAncestors(structuredClone(ancestors), key),
    ]) as PersistedFragmentSpread[]),
  ];
};
