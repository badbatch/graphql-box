import { GraphQLBoolean, GraphQLInterfaceType, GraphQLString } from "graphql";

export default new GraphQLInterfaceType({
  fields: () => ({
    availability: { type: GraphQLString },
    available: { type: GraphQLBoolean },
    id: { type: GraphQLString },
    subscribable: { type: GraphQLBoolean },
  }),
  name: "Inventory",
});
