import { GraphQLSchema } from "graphql";
import mutationType from "./types/mutation";
import queryType from "./types/query";
import subscriptionType from "./types/subscription";
import inventoryType from "./types/query/inventory";
import listingInventoryType from "./types/query/inventory/listing";
import productInventoryType from "./types/query/inventory/product";
import skuInventoryType from "./types/query/inventory/sku";

export default new GraphQLSchema({
  mutation: mutationType,
  query: queryType,
  subscription: subscriptionType,
  types: [inventoryType, productInventoryType, skuInventoryType, listingInventoryType],
});
