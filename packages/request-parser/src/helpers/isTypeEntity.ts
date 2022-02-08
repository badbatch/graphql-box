import { GraphQLNamedType, GraphQLOutputType } from "graphql";

export default (type: GraphQLNamedType | GraphQLOutputType, typeIDKey: string) => {
  if (!("getFields" in type)) {
    return false;
  }

  const fields = type.getFields();
  return !!fields[typeIDKey];
};
