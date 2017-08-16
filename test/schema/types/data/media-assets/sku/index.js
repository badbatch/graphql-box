import MediaAsset from '../../media-asset';

/**
 *
 * The sku media assets data type
 */
export default class SkuMediaAssets {
  /**
   *
   * @constructor
   * @param {Object} data
   * @return {void}
   */
  constructor(data) {
    this.defaultImage = data.defaultImage ? new MediaAsset(data.defaultImage) : null;
    this.skuMedia = null;

    if (data.skuMedia) {
      this.skuMedia = [];

      data.skuMedia.forEach((mediaAsset) => {
        this.skuMedia.push(new MediaAsset(mediaAsset));
      });
    }

    this.pings = null;

    if (data.pings) {
      this.pings = [];

      data.pings.forEach((mediaAsset) => {
        this.pings.push(new MediaAsset(mediaAsset));
      });
    }
  }
}
