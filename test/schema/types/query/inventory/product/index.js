import { GraphQLBoolean, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import Inventory from '../';
import ProductInventoryDataType from '../../../data/inventory/product';

export default new GraphQLObjectType({
  name: 'ProductInventory',
  interfaces: [Inventory],
  fields: () => ({
    availability: { type: GraphQLString },
    available: { type: GraphQLBoolean },
    id: { type: GraphQLString },
    skus: { type: new GraphQLList(Inventory) },
    subscribable: { type: GraphQLBoolean },
  }),
  isTypeOf: value => value instanceof ProductInventoryDataType,
});
