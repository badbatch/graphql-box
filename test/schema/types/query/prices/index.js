import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'Prices',
  fields: () => ({
    clubcardPoints: { type: GraphQLString },
    fromPrice: { type: GraphQLString },
    id: { type: GraphQLString },
    price: { type: GraphQLString },
    savings: { type: GraphQLString },
    toPrice: { type: GraphQLString },
    was: { type: GraphQLString },
    wasWas: { type: GraphQLString },
  }),
});
