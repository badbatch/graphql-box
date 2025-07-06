import { type CalculateIteratorCallbackOptions } from '#types.ts';

export const connectionIteratorCallback = ({
  fieldTypeName,
  isFieldTypeList,
  variables,
}: CalculateIteratorCallbackOptions<{ first?: number; last?: number }>): number | undefined => {
  if (!(isFieldTypeList && fieldTypeName?.endsWith('Edge'))) {
    return;
  }

  return variables?.first || variables?.last ? (variables.first ?? variables.last) : undefined;
};
