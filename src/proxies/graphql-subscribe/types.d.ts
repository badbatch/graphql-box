import { GraphQLFieldResolver, GraphQLSchema } from "graphql";

export interface GraphQLSubscribeProxyArgs {
  fieldResolver?: GraphQLFieldResolver<any, any>;
  rootValue?: any;
  schema: GraphQLSchema;
  subscribeFieldResolver?: GraphQLFieldResolver<any, any>;
}
