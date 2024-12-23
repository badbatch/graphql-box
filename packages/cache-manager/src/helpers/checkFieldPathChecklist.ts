import { type CheckFieldPathChecklistResult, type FieldPathChecklistValue } from '../types.ts';

export const checkFieldPathChecklist = (
  fieldPathChecklistValues: FieldPathChecklistValue[] | undefined,
  fieldTypeName: string | undefined,
): CheckFieldPathChecklistResult => {
  if (!fieldPathChecklistValues || fieldPathChecklistValues.length === 0) {
    return { hasData: false, typeUnused: !!fieldTypeName };
  }

  const [fieldPathChecklistValue] = fieldPathChecklistValues;

  if (fieldPathChecklistValue) {
    const { hasData, typeName } = fieldPathChecklistValue;
    const typeUnused = typeName ? typeName !== fieldTypeName : undefined;
    return { hasData, typeUnused };
  }

  return {
    hasData: fieldPathChecklistValues.some(({ hasData, typeName }) => typeName === fieldTypeName && hasData),
    typeUnused: !fieldPathChecklistValues.every(({ typeName }) => typeName === fieldTypeName),
  };
};
