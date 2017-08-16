import { GraphQLBoolean, GraphQLInterfaceType, GraphQLString } from 'graphql';

export default new GraphQLInterfaceType({
  name: 'Inventory',
  fields: () => ({
    availability: { type: GraphQLString },
    available: { type: GraphQLBoolean },
    id: { type: GraphQLString },
    subscribable: { type: GraphQLBoolean },
  }),
});
