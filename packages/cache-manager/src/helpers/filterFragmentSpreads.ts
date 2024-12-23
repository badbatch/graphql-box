import { deleteFragmentSpreads } from '@graphql-box/helpers';
import { type FieldNode, type FragmentDefinitionNode, type OperationDefinitionNode } from 'graphql';
import { isEmpty } from 'lodash-es';
import { type FragmentSpreadFieldCounter } from '../types.ts';
import { type FragmentSpreadCheckist } from './createFragmentSpreadChecklist.ts';

export const filterFragmentSpreads = (
  field: FieldNode | FragmentDefinitionNode | OperationDefinitionNode,
  fragmentSpreadFieldCounter: FragmentSpreadFieldCounter,
  fragmentSpreadChecklist: FragmentSpreadCheckist,
  ancestorRequestFieldPath: string,
) => {
  if (isEmpty(fragmentSpreadFieldCounter)) {
    return;
  }

  for (const [key, value] of Object.entries(fragmentSpreadFieldCounter)) {
    const checklist = fragmentSpreadChecklist[key];

    if (!checklist) {
      continue;
    }

    checklist.paths.push(ancestorRequestFieldPath);
    const { hasData, total } = value;

    if (hasData === total) {
      deleteFragmentSpreads(field, key);
      checklist.deleted += 1;
    }
  }
};
