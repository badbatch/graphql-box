import { Maybe } from "@graphql-box/core";
import { GraphQLOutputType, GraphQLScalarType } from "graphql";

export default (fieldTypeList: Maybe<GraphQLOutputType>[], typeComplexityMap: Record<string, number>) => {
  return fieldTypeList.reduce((complexity: number, fieldType) => {
    if (!fieldType || fieldType instanceof GraphQLScalarType || !("name" in fieldType)) {
      return complexity;
    }

    const typeComplexity = typeComplexityMap[fieldType.name];
    return typeComplexity ? complexity + typeComplexity : complexity;
  }, 0);
};
