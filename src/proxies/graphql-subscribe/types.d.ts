export interface GraphQLSubscribeProxyArgs {
  fieldResolver?: GraphQLFieldResolver<any, any>;
  rootValue?: any;
  schema?: GraphQLSchema;
  subscribeFieldResolver?: GraphQLFieldResolver<any, any>;
}
