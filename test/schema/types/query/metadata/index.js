import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'Metadata',
  fields: () => ({
    cacheControl: { type: GraphQLString },
  }),
});
