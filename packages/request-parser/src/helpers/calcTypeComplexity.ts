import { type Maybe } from '@graphql-box/core';
import { type GraphQLOutputType, GraphQLScalarType } from 'graphql';

export const calcTypeComplexity = (
  fieldTypeList: Maybe<GraphQLOutputType>[],
  typeComplexityMap: Record<string, number>,
) => {
  return fieldTypeList.reduce((complexity: number, fieldType) => {
    if (!fieldType || fieldType instanceof GraphQLScalarType || !('name' in fieldType)) {
      return complexity;
    }

    const typeComplexity = typeComplexityMap[fieldType.name];
    return typeComplexity ? complexity + typeComplexity : complexity;
  }, 0);
};
