import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import favouritesType from "./favourites";
import productType from "./product";
import skuType from "./sku";
import { fetchData, queryDatabase } from "../../helpers";

export default new GraphQLObjectType({
  fields: () => ({
    favourites: {
      resolve: async (obj) => queryDatabase({ cmd: "get", type: "favourites" }),
      type: favouritesType,
    },
    product: {
      args: { id: { type: GraphQLString } },
      resolve: async (obj, args) => fetchData("product", args),
      type: productType,
    },
    products: {
      args: { id: { type: new GraphQLList(GraphQLString) } },
      resolve: async (obj, args) => fetchData("product", args),
      type: new GraphQLList(productType),
    },
    sku: {
      args: { id: { type: GraphQLString } },
      resolve: async (obj, args) => fetchData("sku", args),
      type: skuType,
    },
  }),
  name: "Query",
});
