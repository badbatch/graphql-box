import {
  GraphQLField,
  GraphQLList,
  GraphQLNonNull,
  GraphQLOutputType,
} from "graphql";
import { OF_TYPE } from "../../consts";
import * as defs from "../../defs";

export function getType({ type }: GraphQLField<any, any>): GraphQLOutputType {
  if (!type.hasOwnProperty(OF_TYPE)) return type;

  const listOrNonNullType = type as GraphQLList<any> | GraphQLNonNull<defs.GraphQLNullableOutputType>;
  return listOrNonNullType.ofType;
}
