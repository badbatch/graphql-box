import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from "graphql";

export default new GraphQLObjectType({
  fields: () => ({
    alt: { type: GraphQLString },
    defaultImage: { type: GraphQLBoolean },
    mediaType: { type: GraphQLString },
    renderSource: { type: GraphQLString },
    src: { type: GraphQLString },
  }),
  name: "MediaAsset",
});
