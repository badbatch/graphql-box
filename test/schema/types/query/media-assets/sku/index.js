import { GraphQLList, GraphQLObjectType } from 'graphql';
import MediaAsset from '../../media-asset';

export default new GraphQLObjectType({
  name: 'SkuMediaAssets',
  fields: () => ({
    defaultImage: { type: MediaAsset },
    skuMedia: { type: new GraphQLList(MediaAsset) },
    pings: { type: new GraphQLList(MediaAsset) },
  }),
});
