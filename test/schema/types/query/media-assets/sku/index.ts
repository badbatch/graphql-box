import { GraphQLList, GraphQLObjectType } from "graphql";
import mediaAssetType from "../../media-asset";

export default new GraphQLObjectType({
  fields: () => ({
    defaultImage: { type: mediaAssetType },
    pings: { type: new GraphQLList(mediaAssetType) },
    skuMedia: { type: new GraphQLList(mediaAssetType) },
  }),
  name: "SkuMediaAssets",
});
