import { GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql";
import metadataType from "../metadata";
import productType from "../product";
import { fetchData } from "../../../helpers";

export default new GraphQLObjectType({
  fields: () => ({
    _metadata: { type: metadataType },
    count: { type: GraphQLInt },
    id: { type: GraphQLInt },
    products: {
      resolve: async (obj: { products: string[] }) => {
        if (!obj.products || !obj.products.length) return [];
        return fetchData("product", { id: obj.products });
      },
      type: new GraphQLList(productType),
    },
  }),
  name: "Favourites",
});
