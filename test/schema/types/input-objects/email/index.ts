import {
  GraphQLInputObjectType,
  GraphQLString,
} from "graphql";

export default new GraphQLInputObjectType({
  fields: () => ({
    from: { type: GraphQLString },
    message: { type: GraphQLString },
    subject: { type: GraphQLString },
  }),
  name: "EmailInput",
});
