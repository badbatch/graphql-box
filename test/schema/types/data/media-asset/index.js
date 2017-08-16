/**
 *
 * The media asset data type
 */
export default class MediaAsset {
  /**
   *
   * @constructor
   * @param {Object} data
   * @return {void}
   */
  constructor(data) {
    this.alt = data.alt || null;
    this.defaultImage = data.defaultImage || null;
    this.mediaType = data.mediaType || null;
    this.renderSource = data.renderSource || null;
    this.src = data.src || null;
  }
}
