import { type GraphQLField, type GraphQLOutputType } from 'graphql';
import { OF_TYPE } from '../constants.ts';

export const unwrapOfType = (type: GraphQLOutputType): GraphQLOutputType => {
  if (!(OF_TYPE in type)) {
    return type;
  }

  return unwrapOfType(type.ofType);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getType = ({ type }: GraphQLField<any, any>): GraphQLOutputType => {
  return unwrapOfType(type);
};
