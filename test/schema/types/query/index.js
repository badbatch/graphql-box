import { GraphQLObjectType, GraphQLString } from 'graphql';
import Product from './product';
import Sku from './sku';
import { fetchData } from '../../helpers';

export default new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    product: {
      type: Product,
      args: { id: { type: GraphQLString } },
      resolve: async (obj, args) => fetchData('product', args),
    },
    sku: {
      type: Sku,
      args: { id: { type: GraphQLString } },
      resolve: async (obj, args) => fetchData('sku', args),
    },
  }),
});
