import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from "graphql";
import Inventory from "../";
import ListingInventory from "../../../data/inventory/listing";

export default new GraphQLObjectType({
  fields: () => ({
    availability: { type: GraphQLString },
    available: { type: GraphQLBoolean },
    id: { type: GraphQLString },
    subscribable: { type: GraphQLBoolean },
  }),
  interfaces: [Inventory],
  isTypeOf: (value) => value instanceof ListingInventory,
  name: "ListingInventory",
});
