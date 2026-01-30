import { type GraphQLType, isListType, isNonNullType } from 'graphql';
import { type Maybe } from 'graphql/jsutils/Maybe.js';

export const unwrapNonNull = (type: GraphQLType): GraphQLType => {
  return isNonNullType(type) ? unwrapNonNull(type.ofType) : type;
};

export const isListLike = (type: Maybe<GraphQLType>): boolean => {
  return type ? isListType(unwrapNonNull(type)) : false;
};
