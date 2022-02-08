import { ParsedDirective } from "@graphql-box/helpers";
import {
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLUnionType,
} from "graphql";
import { isEmpty } from "lodash";

export default (
  type: GraphQLOutputType | GraphQLNamedType | undefined,
  parsedDirectives: ParsedDirective[] = [],
): type is GraphQLOutputType | GraphQLNamedType =>
  !!type &&
  (type instanceof GraphQLObjectType ||
    type instanceof GraphQLInterfaceType ||
    type instanceof GraphQLUnionType ||
    !isEmpty(parsedDirectives));
