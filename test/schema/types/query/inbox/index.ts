import { GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql";
import emailType from "../email";
import metadataType from "../metadata";
import { queryDatabase } from "../../../helpers";
import { ObjectMap } from "../../../../../src/types";

export default new GraphQLObjectType({
  fields: () => ({
    _metadata: { type: metadataType },
    emails: {
      resolve: () => queryDatabase({ cmd: "get", type: "emails" }) || [],
      type: new GraphQLList(emailType),
    },
    id: { type: GraphQLInt },
    total: {
      resolve: (obj) => (queryDatabase({ cmd: "get", type: "emails" }) || []).length,
      type: GraphQLInt,
    },
    unread: {
      resolve: () => (queryDatabase({ cmd: "get", type: "emails" }) || [])
        .filter((email: ObjectMap) => email.unread).length,
      type: GraphQLInt,
    },
  }),
  name: "Inbox",
});
