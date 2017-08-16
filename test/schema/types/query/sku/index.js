import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { get } from 'lodash';
import Inventory from '../inventory';
import SkuMediaAsseets from '../media-assets/sku';
import Prices from '../prices';
import { fetchData } from '../../../helpers';

const SkuAttributes = new GraphQLObjectType({
  name: 'SkuAttributes',
  fields: () => ({
    classification: { type: GraphQLString },
    colour: { type: GraphQLString },
    mediaType: { type: GraphQLString },
    size: { type: GraphQLString },
  }),
});

const Sku = new GraphQLObjectType({
  name: 'Sku',
  fields: () => ({
    accessories: {
      type: new GraphQLList(Sku),
      resolve: async (obj) => {
        const data = await fetchData('accessories', { id: obj.id });
        const links = get(data, ['links']);
        if (!links || !links.length) return [];
        return fetchData('sku', { id: links.map(link => link.id) });
      },
    },
    attributes: { type: SkuAttributes },
    authors: { type: GraphQLString },
    avgRating: { type: GraphQLFloat },
    bookDetails: { type: GraphQLString },
    commercialReleaseDateFormatted: { type: GraphQLString },
    displayName: { type: GraphQLString },
    id: { type: GraphQLString },
    inventory: {
      type: Inventory,
      resolve: async obj => fetchData('sku', { id: obj.id }, { batch: true }),
    },
    longDescription: { type: GraphQLString },
    mediaAssets: { type: SkuMediaAsseets },
    noofRatingsProduced: { type: GraphQLInt },
    prices: { type: Prices },
    publicLink: { type: GraphQLString },
    range: {
      type: new GraphQLList(Sku),
      resolve: async (obj) => {
        const data = await fetchData('range', { id: obj.id });
        const links = get(data, ['links']);
        if (!links || !links.length) return [];
        return fetchData('sku', { id: links.map(link => link.id) });
      },
    },
    rangedInStore: { type: GraphQLBoolean },
    skuSynopsis: { type: GraphQLString },
  }),
});

export default Sku;
