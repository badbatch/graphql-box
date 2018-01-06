import { GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql";
import productType from "../product";
import { fetchData } from "../../../helpers";

export default new GraphQLObjectType({
  fields: () => ({
    count: { type: GraphQLInt },
    products: {
      resolve: async (obj: { items: string[] }) => {
        if (!obj.items || !obj.items.length) return [];
        return fetchData("product", { id: obj.items });
      },
      type: new GraphQLList(productType),
    },
  }),
  name: "Favourites",
});
