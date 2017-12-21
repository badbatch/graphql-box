import { GraphQLBoolean, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import Inventory from "../";
import SkuInventory from "../../../data/inventory/sku";

export default new GraphQLObjectType({
  fields: () => ({
    availability: { type: GraphQLString },
    available: { type: GraphQLBoolean },
    id: { type: GraphQLString },
    listings: { type: new GraphQLList(Inventory) },
    subscribable: { type: GraphQLBoolean },
  }),
  interfaces: [Inventory],
  isTypeOf: (value) => value instanceof SkuInventory,
  name: "SkuInventory",
});
