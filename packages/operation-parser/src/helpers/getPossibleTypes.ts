import { GraphQLInterfaceType, type GraphQLOutputType, type GraphQLSchema, GraphQLUnionType } from 'graphql';

export const getPossibleTypes = (schema: GraphQLSchema, type: GraphQLOutputType): string[] => {
  if (type instanceof GraphQLInterfaceType || type instanceof GraphQLUnionType) {
    return schema.getPossibleTypes(type).map(possibleType => possibleType.name);
  }

  return [];
};
