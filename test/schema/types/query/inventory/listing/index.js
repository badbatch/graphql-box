import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from 'graphql';
import Inventory from '../';
import ListingInventoryDataType from '../../../data/inventory/listing';

export default new GraphQLObjectType({
  name: 'ListingInventory',
  interfaces: [Inventory],
  fields: () => ({
    availability: { type: GraphQLString },
    available: { type: GraphQLBoolean },
    id: { type: GraphQLString },
    subscribable: { type: GraphQLBoolean },
  }),
  isTypeOf: value => value instanceof ListingInventoryDataType,
});
