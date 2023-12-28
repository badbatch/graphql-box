import { type VisitorContext } from '../types.ts';

export const getPersistedFragmentSpreadNames = (persistedFragmentSpreads: VisitorContext['persistedFragmentSpreads']) =>
  persistedFragmentSpreads.map(([name]) => name);
