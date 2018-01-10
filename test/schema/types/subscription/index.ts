import { GraphQLObjectType } from "graphql";
import inboxType from "../query/inbox";
import favouritesType from "../query/favourites";
import pubsub from "../../pubsub";

export default new GraphQLObjectType({
  fields: () => ({
    emailAdded: {
      subscribe: () => pubsub.asyncIterator("emailAdded"),
      type: inboxType,
    },
    favouriteAdded: {
      subscribe: () => pubsub.asyncIterator("favouriteAdded"),
      type: favouritesType,
    },
  }),
  name: "Subscription",
});
