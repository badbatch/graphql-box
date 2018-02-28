import { GraphQLBoolean, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import Inventory from "../";
import ProductInventory from "../../../data/inventory/product";

export default new GraphQLObjectType({
  fields: () => ({
    availability: { type: GraphQLString },
    available: { type: GraphQLBoolean },
    id: { type: GraphQLString },
    skus: { type: new GraphQLList(Inventory) },
    subscribable: { type: GraphQLBoolean },
  }),
  interfaces: [Inventory],
  isTypeOf: (value) => value instanceof ProductInventory,
  name: "ProductInventory",
});
