import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import FavouritesType from "../query/favourites";
import { queryDatabase } from "../../helpers";

export default new GraphQLObjectType({
  fields: () => ({
    addFavourite: {
      args: { productID: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: async (obj, { productID }) => {
        queryDatabase({
          callback: (dataType, value) => {
            if (!dataType.products) dataType.products = [];
            dataType.products.push(value);
            dataType.count = dataType.products.length;
            dataType.id = 1;
          },
          cmd: "set",
          type: "favourites",
          value: productID,
        });

        return queryDatabase({ cmd: "get", type: "favourites" });
      },
      type: FavouritesType,
    },
  }),
  name: "Mutation",
});