import { type GraphQLField, type GraphQLOutputType } from 'graphql';
import { OF_TYPE } from '../constants.ts';

export const unwrapOfType = (type: GraphQLOutputType): GraphQLOutputType => {
  if (!(OF_TYPE in type)) {
    return type;
  }

  return unwrapOfType(type.ofType);
};

export const getType = ({ type }: GraphQLField<unknown, unknown>): GraphQLOutputType => {
  return unwrapOfType(type);
};
