import { GraphQLField, GraphQLList, GraphQLNonNull, GraphQLOutputType } from "graphql";
import { OF_TYPE } from "../../consts";
import { GraphQLNullableOutputType } from "../../defs";

function unwrapOfType(type: GraphQLOutputType): GraphQLOutputType {
  if (!type.hasOwnProperty(OF_TYPE)) return type;

  const listOrNonNullType = type as GraphQLList<any> | GraphQLNonNull<GraphQLNullableOutputType>;
  return unwrapOfType(listOrNonNullType.ofType);
}

export function getType({ type }: GraphQLField<any, any>): GraphQLOutputType {
  return unwrapOfType(type);
}
