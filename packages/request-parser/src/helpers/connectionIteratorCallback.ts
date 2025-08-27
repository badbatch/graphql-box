import { type CalculateIteratorCallbackOptions } from '#types.ts';

export const connectionIteratorCallback = ({
  fieldArgs,
  fieldTypeName,
  isFieldTypeList,
}: CalculateIteratorCallbackOptions<{ first?: number; last?: number }>): number | undefined => {
  if (!(isFieldTypeList && fieldTypeName?.endsWith('Edge'))) {
    return;
  }

  return fieldArgs?.first || fieldArgs?.last ? (fieldArgs.first ?? fieldArgs.last) : undefined;
};
