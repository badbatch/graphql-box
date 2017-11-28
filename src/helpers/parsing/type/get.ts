import {
  GraphQLField,
  GraphQLList,
  GraphQLNonNull,
  GraphQLOutputType,
} from "graphql";

import { GraphQLNullableOutputType } from "../types";

export default function getType({ type }: GraphQLField<any, any>): GraphQLOutputType {
  if (!type.hasOwnProperty("ofType")) return type;
  const listOrNonNullType = type as GraphQLList<any> | GraphQLNonNull<GraphQLNullableOutputType>;
  return listOrNonNullType.ofType;
}
