import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

export default new GraphQLObjectType({
  fields: () => ({
    clubcardPoints: { type: GraphQLInt },
    fromPrice: { type: GraphQLString },
    id: { type: GraphQLString },
    price: { type: GraphQLString },
    savings: { type: GraphQLString },
    toPrice: { type: GraphQLString },
    was: { type: GraphQLString },
    wasWas: { type: GraphQLString },
  }),
  name: "Prices",
});
