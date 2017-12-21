import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import Inventory from "../inventory";
import metadataType from "../metadata";
import ProductMediaAsseets from "../media-assets/product";
import pricesType from "../prices";
import skuType from "../sku";
import { fetchData, getLinks } from "../../../helpers";
import { ObjectMap } from "../../../../../src/types";

const productOptionsInfoType = new GraphQLObjectType({
  fields: () => ({
    internalName: { type: GraphQLString },
    name: { type: GraphQLString },
    type: { type: GraphQLString },
  }),
  name: "ProductOptionsInfo",
});

const productType: GraphQLObjectType = new GraphQLObjectType({
  fields: () => ({
    _metadata: { type: metadataType },
    avgRating: { type: GraphQLFloat },
    brand: { type: GraphQLString },
    childSkus: {
      resolve: async (obj: { links: ObjectMap[] }) => {
        const links: ObjectMap[] = getLinks(obj, "childSku");
        if (!links || !links.length) return [];
        return fetchData("sku", { id: links.map((link) => link.id) });
      },
      type: new GraphQLList(skuType),
    },
    completeTheLook: {
      resolve: async (obj: { links: ObjectMap[] }) => {
        const links: ObjectMap[] = getLinks(obj, "completeTheLook");
        if (!links || !links.length) return [];
        return fetchData("product", { id: links.map((link) => link.id) });
      },
      type: new GraphQLList(productType),
    },
    displayName: { type: GraphQLString },
    giftMessagingEnabled: { type: GraphQLBoolean },
    id: { type: GraphQLString },
    inventory: {
      resolve: async (obj: ObjectMap) => fetchData("product", { id: obj.id }, { batch: true }),
      type: Inventory,
    },
    longDescription: { type: GraphQLString },
    matchingItems: {
      resolve: async (obj: { links: ObjectMap[] }) => {
        const links: ObjectMap[] = getLinks(obj, "outFit");
        if (!links || !links.length) return [];
        return fetchData("product", { id: links.map((link) => link.id) });
      },
      type: new GraphQLList(productType),
    },
    mediaAssets: { type: ProductMediaAsseets },
    noofRatingsProduced: { type: GraphQLInt },
    optionsInfo: { type: new GraphQLList(productOptionsInfoType) },
    prices: { type: pricesType },
    publicLink: { type: GraphQLString },
    userActionable: { type: GraphQLBoolean },
  }),
  name: "Product",
});

export default productType;
