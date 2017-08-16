import { GraphQLObjectType } from 'graphql';
import MediaAsset from '../../media-asset';

const DefaultSkuMediaAssets = new GraphQLObjectType({
  name: 'DefaultSkuMediaAssets',
  fields: () => ({
    defaultImage: { type: MediaAsset },
  }),
});

export default new GraphQLObjectType({
  name: 'ProductMediaAssets',
  fields: () => ({
    defaultSku: { type: DefaultSkuMediaAssets },
  }),
});
