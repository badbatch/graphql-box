import { type GraphQLField, type GraphQLOutputType } from 'graphql';

export const unwrapOfType = (type: GraphQLOutputType): GraphQLOutputType => {
  if (!('ofType' in type)) {
    return type;
  }

  return unwrapOfType(type.ofType);
};

export const getType = ({ type }: GraphQLField<unknown, unknown>): GraphQLOutputType => {
  return unwrapOfType(type);
};
