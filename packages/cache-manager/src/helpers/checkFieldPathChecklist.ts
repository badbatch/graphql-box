import { CheckFieldPathChecklistResult, FieldPathChecklistValue } from "../defs";

export default (
  fieldPathChecklistValues: FieldPathChecklistValue[] | undefined,
  fieldTypeName: string | undefined,
): CheckFieldPathChecklistResult => {
  if (!fieldPathChecklistValues || !fieldPathChecklistValues.length) {
    return { hasData: false, typeUnused: !!fieldTypeName };
  }

  if (fieldPathChecklistValues.length === 1) {
    const { hasData, typeName } = fieldPathChecklistValues[0];
    const typeUnused = !typeName ? undefined : typeName !== fieldTypeName;
    return { hasData, typeUnused };
  }

  return {
    hasData: fieldPathChecklistValues.some(({ hasData, typeName }) => typeName === fieldTypeName && hasData),
    typeUnused: !fieldPathChecklistValues.every(({ typeName }) => typeName === fieldTypeName),
  };
};
