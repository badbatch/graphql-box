import { ObjectMap } from "../../../../../src/types";

export default class MediaAsset {
  constructor(data: ObjectMap) {
    Object.assign(this, data);
  }
}
