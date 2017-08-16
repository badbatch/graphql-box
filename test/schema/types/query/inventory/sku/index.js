import { GraphQLBoolean, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import Inventory from '../';
import SkuInventoryDataType from '../../../data/inventory/sku';

export default new GraphQLObjectType({
  name: 'SkuInventory',
  interfaces: [Inventory],
  fields: () => ({
    availability: { type: GraphQLString },
    available: { type: GraphQLBoolean },
    id: { type: GraphQLString },
    listings: { type: new GraphQLList(Inventory) },
    subscribable: { type: GraphQLBoolean },
  }),
  isTypeOf: value => value instanceof SkuInventoryDataType,
});
