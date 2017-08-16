import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import Inventory from '../inventory';
import ProductMediaAsseets from '../media-assets/product';
import Prices from '../prices';
import Sku from '../sku';
import { fetchData, getLinks } from '../../../helpers';

const ProductOptionsInfo = new GraphQLObjectType({
  name: 'ProductOptionsInfo',
  fields: () => ({
    type: { type: GraphQLString },
    name: { type: GraphQLString },
    internalName: { type: GraphQLString },
  }),
});

const Product = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    avgRating: { type: GraphQLFloat },
    brand: { type: GraphQLString },
    childSkus: {
      type: new GraphQLList(Sku),
      resolve: async (obj) => {
        const links = getLinks(obj, 'childSku');
        if (!links || !links.length) return [];
        return fetchData('sku', { id: links.map(link => link.id) });
      },
    },
    completeTheLook: {
      type: new GraphQLList(Product),
      resolve: async (obj) => {
        const links = getLinks(obj, 'completeTheLook');
        if (!links || !links.length) return [];
        return fetchData('product', { id: links.map(link => link.id) });
      },
    },
    displayName: { type: GraphQLString },
    giftMessagingEnabled: { type: GraphQLBoolean },
    id: { type: GraphQLString },
    inventory: {
      type: Inventory,
      resolve: async obj => fetchData('product', { id: obj.id }, { batch: true }),
    },
    longDescription: { type: GraphQLString },
    mediaAssets: { type: ProductMediaAsseets },
    noofRatingsProduced: { type: GraphQLInt },
    optionsInfo: { type: new GraphQLList(ProductOptionsInfo) },
    matchingItems: {
      type: new GraphQLList(Product),
      resolve: async (obj) => {
        const links = getLinks(obj, 'outFit');
        if (!links || !links.length) return [];
        return fetchData('product', { id: links.map(link => link.id) });
      },
    },
    prices: { type: Prices },
    publicLink: { type: GraphQLString },
    userActionable: { type: GraphQLBoolean },
  }),
});

export default Product;
