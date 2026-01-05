import { type GraphQLNamedType, isInterfaceType, isObjectType, isUnionType } from 'graphql';

export const isTypeEntity = (type: GraphQLNamedType | undefined, idKey: string): boolean => {
  if (isUnionType(type)) {
    return type.getTypes().some(t => isTypeEntity(t, idKey));
  }

  if (isObjectType(type) || isInterfaceType(type)) {
    const fields = type.getFields();
    return !!fields[idKey];
  }

  return false;
};
