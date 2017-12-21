import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import productType from "./product";
import skuType from "./sku";
import { fetchData } from "../../helpers";

export default new GraphQLObjectType({
  fields: () => ({
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
