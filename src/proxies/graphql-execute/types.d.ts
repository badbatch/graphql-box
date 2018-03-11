import { GraphQLFieldResolver, GraphQLSchema } from "graphql";

export interface GraphQLExecuteProxyArgs {
  fieldResolver?: GraphQLFieldResolver<any, any>;
  rootValue?: any;
  schema: GraphQLSchema;
}
