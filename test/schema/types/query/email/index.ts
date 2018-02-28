import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import metadataType from "../metadata";

export default new GraphQLObjectType({
  fields: () => ({
    _metadata: { type: metadataType },
    from: { type: GraphQLString },
    id: { type: GraphQLInt },
    message: { type: GraphQLString },
    subject: { type: GraphQLString },
    unread: { type: GraphQLBoolean },
  }),
  name: "Email",
});
