import { type RequestOptions } from '@graphql-box/core';
import { type ParsedDirective, getFragmentSpreadDirectives } from '@graphql-box/helpers';
import { type FieldNode, type FragmentDefinitionNode, type InlineFragmentNode } from 'graphql';
import { isEmpty } from 'lodash-es';
import { type Ancestors, type VisitorContext } from '../types.ts';
import { groupFragmentSpreadDirectives } from './groupFragmentSpreadDirectives.ts';
import { hasActiveDeferOrStreamDirective } from './hasActiveDeferOrStreamDirective.ts';
import { updatePersistedFragmentSpreads } from './updatePersistedFragmentSpreads.ts';

export const setFragmentAndDirectiveContextProps = (
  node: FieldNode | InlineFragmentNode | FragmentDefinitionNode,
  ancestors: Ancestors,
  options: RequestOptions,
  context: VisitorContext,
  parsedDirectives: ParsedDirective[] = []
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
        '@graphql-box/request-parser >> to use defer/stream directives, please set the experimentalDeferStreamSupport flag to true'
      );
    }
  }
};
