import { type ParsedDirective } from '@graphql-box/helpers';
import {
  GraphQLInterfaceType,
  type GraphQLNamedType,
  GraphQLObjectType,
  type GraphQLOutputType,
  GraphQLUnionType,
} from 'graphql';
import { isEmpty } from 'lodash-es';

export const toUpdateNode = (
  type: GraphQLOutputType | GraphQLNamedType | undefined,
  parsedDirectives: ParsedDirective[] = [],
): type is GraphQLOutputType | GraphQLNamedType =>
  !!type &&
  (type instanceof GraphQLObjectType ||
    type instanceof GraphQLInterfaceType ||
    type instanceof GraphQLUnionType ||
    !isEmpty(parsedDirectives));
