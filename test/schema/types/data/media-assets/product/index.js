import { has } from 'lodash';
import MediaAsset from '../../media-asset';

/**
 *
 * The product media assets data type
 */
export default class ProductMediaAssets {
  /**
   *
   * @constructor
   * @param {Object} data
   * @return {void}
   */
  constructor(data) {
    this.defaultSku = null;

    if (has(data, 'defaultSku', 'defaultImage')) {
      this.defaultSku = { defaultImage: new MediaAsset(data.defaultSku.defaultImage) };
    }
  }
}
