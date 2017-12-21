import { GraphQLObjectType } from "graphql";
import mediaAssetType from "../../media-asset";

const defaultSkuMediaAssetsType = new GraphQLObjectType({
  fields: () => ({
    defaultImage: { type: mediaAssetType },
  }),
  name: "DefaultSkuMediaAssets",
});

export default new GraphQLObjectType({
  fields: () => ({
    defaultSku: { type: defaultSkuMediaAssetsType },
  }),
  name: "ProductMediaAssets",
});
