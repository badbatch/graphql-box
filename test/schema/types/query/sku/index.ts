import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import { get } from "lodash";
import Inventory from "../inventory";
import metadataType from "../metadata";
import SkuMediaAsseets from "../media-assets/sku";
import pricesType from "../prices";
import productType from "../product";
import { fetchData, getLinks } from "../../../helpers";
import { ObjectMap } from "../../../../../src/types";

const skuAttributeType = new GraphQLObjectType({
  fields: () => ({
    classification: { type: GraphQLString },
    colour: { type: GraphQLString },
    mediaType: { type: GraphQLString },
    size: { type: GraphQLString },
  }),
  name: "SkuAttributes",
});

const skuType: GraphQLObjectType = new GraphQLObjectType({
  fields: () => ({
    _metadata: { type: metadataType },
    accessories: {
      resolve: async (obj: ObjectMap) => {
        const data: ObjectMap = await fetchData("accessories", { id: obj.id });
        const links: ObjectMap[] = get(data, ["links"]);
        if (!links || !links.length) return [];
        return fetchData("sku", { id: links.map((link) => link.id) });
      },
      type: new GraphQLList(skuType),
    },
    attributes: { type: skuAttributeType },
    authors: { type: GraphQLString },
    avgRating: { type: GraphQLFloat },
    bookDetails: { type: GraphQLString },
    commercialReleaseDateFormatted: { type: GraphQLString },
    displayName: { type: GraphQLString },
    id: { type: GraphQLString },
    inventory: {
      resolve: async (obj: ObjectMap) => fetchData("sku", { id: obj.id }, { batch: true }),
      type: Inventory,
    },
    longDescription: { type: GraphQLString },
    mediaAssets: { type: SkuMediaAsseets },
    noofRatingsProduced: { type: GraphQLInt },
    parentProduct: {
      resolve: async (obj: { links: ObjectMap[] }) => {
        const links: ObjectMap[] = getLinks(obj, "parent");
        if (!links || !links.length) return [];
        return fetchData("product", { id: links[0].id });
      },
      type: productType,
    },
    prices: { type: pricesType },
    publicLink: { type: GraphQLString },
    range: {
      resolve: async (obj: ObjectMap) => {
        const data: ObjectMap = await fetchData("range", { id: obj.id });
        const links: ObjectMap[] = get(data, ["links"]);
        if (!links || !links.length) return [];
        return fetchData("sku", { id: links.map((link) => link.id) });
      },
      type: new GraphQLList(skuType),
    },
    rangedInStore: {
      resolve: (obj: ObjectMap) => !!obj.rangedInStore,
      type: GraphQLBoolean,
    },
    skuSynopsis: { type: GraphQLString },
  }),
  name: "Sku",
});

export default skuType;
