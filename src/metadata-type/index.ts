import { GraphQLObjectType, GraphQLString } from "graphql";

export const MetadataType = new GraphQLObjectType({
  description: "The Metadata type can be used to store cache control directives about its parent type.",
  fields: () => ({
    cacheControl: { type: GraphQLString },
  }),
  name: "Metadata",
});
