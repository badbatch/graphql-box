import { PossibleType } from "@graphql-box/core";
import { GraphQLInterfaceType, GraphQLNamedType, GraphQLOutputType, GraphQLSchema, GraphQLUnionType } from "graphql";
import isTypeEntity from "./isTypeEntity";

export default (type: GraphQLNamedType | GraphQLOutputType, schema: GraphQLSchema, typeIDKey: string) => {
  const possibleTypeDetails: PossibleType[] = [];

  if (type instanceof GraphQLInterfaceType || type instanceof GraphQLUnionType) {
    const possibleTypes = schema.getPossibleTypes(type);

    possibleTypeDetails.push(
      ...possibleTypes.map(possibleType => {
        return {
          isEntity: isTypeEntity(possibleType, typeIDKey),
          typeName: possibleType.name,
        };
      }),
    );
  }

  return possibleTypeDetails;
};
