import { GraphQLSchema } from 'graphql';
import Query from './types/query';
import Inventory from './types/query/inventory';
import ListingInventory from './types/query/inventory/listing';
import ProductInventory from './types/query/inventory/product';
import SkuInventory from './types/query/inventory/sku';

export default new GraphQLSchema({
  types: [Inventory, ProductInventory, SkuInventory, ListingInventory],
  query: Query,
});
