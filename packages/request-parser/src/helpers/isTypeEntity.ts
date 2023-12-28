import { type GraphQLNamedType, type GraphQLOutputType } from 'graphql';

export const isTypeEntity = (type: GraphQLNamedType | GraphQLOutputType, typeIDKey: string) => {
  if (!('getFields' in type)) {
    return false;
  }

  const fields = type.getFields();
  return !!fields[typeIDKey];
};
