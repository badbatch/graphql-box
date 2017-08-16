import { isArray, isBoolean, isPlainObject } from 'lodash';
import Link from '../link';
import ProductMediaAssets from '../media-assets/product';
import Prices from '../prices';

/**
 *
 * The product data type
 */
export default class Product {
  /**
   *
   * @constructor
   * @param {Object} data
   * @return {void}
   */
  constructor(data) {
    this.ancestorCategories = data.ancestorCategories || null;
    this.avgRating = data.avgRating || null;
    this.brand = data.brand || null;
    this.classifactionLabelingPackaging = data.classifactionLabelingPackaging || null;
    this.displayName = data.displayName || null;
    this.dynamicAttributes = data.dynamicAttributes || null;
    this.giftMessagingEnabled = null;
    if (isBoolean(data.giftMessagingEnabled)) this.giftMessagingEnabled = data.giftMessagingEnabled;
    this.id = data.id || null;
    this.links = null;

    if (isArray(data.links)) {
      this.links = [];

      data.links.forEach((link) => {
        this.links.push(new Link(link));
      });
    }

    this.longDescription = data.longDescription || null;
    this.mediaAssets = null;

    if (isPlainObject(data.mediaAssets)) {
      this.mediaAssets = new ProductMediaAssets(data.mediaAssets);
    }

    this.minimumAgeRequired = data.minimumAgeRequired || null;
    this.noofRatingsProduced = data.noofRatingsProduced || null;
    this.optionsInfo = data.optionsInfo || null;
    this.prices = isPlainObject(data.prices) ? new Prices(data.prices) : null;
    this.publicLink = data.publicLink || null;
    this.userActionable = isBoolean(data.userActionable) ? data.userActionable : null;
  }
}
