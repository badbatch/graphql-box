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
            const _dataTypye = dataType || {};
            if (!dataType) db.favourites = _dataTypye;
            if (!_dataTypye.products) _dataTypye.products = [];
            _dataTypye.products.push(value);
            _dataTypye.count = _dataTypye.products.length;
            _dataTypye.id = 1;
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
  }),
  name: "Mutation",
});
