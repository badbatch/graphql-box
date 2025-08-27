import { type GraphQLNamedType, type GraphQLOutputType } from 'graphql';

export const isTypeEntity = (type: GraphQLNamedType | GraphQLOutputType) => {
  if (!('getFields' in type)) {
    return false;
  }

  const fields = type.getFields();
  return !!fields.id;
};
