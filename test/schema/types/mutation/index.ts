import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import emailInputType from "../input-objects/email";
import inboxType from "../query/inbox";
import favouritesType from "../query/favourites";
import { queryDatabase } from "../../helpers";
import pubsub from "../../pubsub";

export default new GraphQLObjectType({
  fields: () => ({
    addEmail: {
      args: { input: { type: emailInputType } },
      resolve: async (obj, { input }) => {
        queryDatabase({
          callback: (db, value, dataType) => {
            if (!dataType) dataType = [];
            value.id = dataType.length;
            value.unread = true;
            dataType.push(value);
            if (!db.inbox) db.inbox = { id: 1 };
          },
          cmd: "set",
          type: "emails",
          value: input,
        });

        const inbox = queryDatabase({ cmd: "get", type: "inbox" });
        pubsub.publish("emailAdded", inbox);
        return inbox;
      },
      type: inboxType,
    },
    addFavourite: {
      args: { productID: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: async (obj, { productID }) => {
        queryDatabase({
          callback: (db, value, dataType) => {
            const _dataType = dataType || {};
            if (!dataType) db.favourites = _dataType;
            if (!_dataType.products) _dataType.products = [];
            if (_dataType.products.includes(value)) return;
            _dataType.products.push(value);
            _dataType.count = _dataType.products.length;
            _dataType.id = 1;
          },
          cmd: "set",
          type: "favourites",
          value: productID,
        });

        const favourites = queryDatabase({ cmd: "get", type: "favourites" });
        pubsub.publish("favouriteAdded", favourites);
        return favourites;
      },
      type: favouritesType,
    },
    removeFavourite: {
      args: { productID: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: async (obj, { productID }) => {
        queryDatabase({
          callback: (db, value, dataType) => {
            if (!dataType) return;
            dataType.products = dataType.products.filter((id: string) => id !== value);
            dataType.count = dataType.products.length;
          },
          cmd: "set",
          type: "favourites",
          value: productID,
        });
      },
      type: favouritesType,
    },
  }),
  name: "Mutation",
});
