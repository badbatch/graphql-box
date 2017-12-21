import { GraphQLObjectType, GraphQLString } from "graphql";

export default new GraphQLObjectType({
  fields: () => ({
    cacheControl: { type: GraphQLString },
  }),
  name: "Metadata",
});
