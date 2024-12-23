import { type RequestOptions } from '@graphql-box/core';
import { getKind, parseDirectiveArguments } from '@graphql-box/helpers';
import { type FragmentSpreadNode } from 'graphql';
import { isEmpty } from 'lodash-es';
import { type Ancestors, type VisitorContext } from '../types.ts';
import { groupFragmentSpreadDirectives } from './groupFragmentSpreadDirectives.ts';
import { hasActiveDeferOrStreamDirective } from './hasActiveDeferOrStreamDirective.ts';
import { updatePersistedFragmentSpreads } from './updatePersistedFragmentSpreads.ts';

export const updateFragmentSpreadNode = (
  node: FragmentSpreadNode,
  ancestors: Ancestors,
  options: RequestOptions,
  context: VisitorContext,
) => {
  if (!node.directives) {
    return;
  }

  const parsedDirectives = parseDirectiveArguments(node.directives, node.name.value, getKind(node), options);
  const groupedFragmentSpreadDirectives = groupFragmentSpreadDirectives(parsedDirectives);

  if (!isEmpty(groupedFragmentSpreadDirectives)) {
    updatePersistedFragmentSpreads(groupedFragmentSpreadDirectives, ancestors, context);
  }

  const hasDeferOrStream = hasActiveDeferOrStreamDirective(parsedDirectives);

  if (hasDeferOrStream) {
    context.hasDeferOrStream = true;

    if (!context.experimentalDeferStreamSupport) {
      throw new Error(
        '@graphql-box/request-parser >> to use defer/stream directives, please set the experimentalDeferStreamSupport flag to true',
      );
    }
  }
};
