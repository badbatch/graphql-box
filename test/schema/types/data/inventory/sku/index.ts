import { ObjectMap } from "../../../../../../src/types";

export default class SkuInventory {
  constructor(data: ObjectMap) {
    Object.assign(this, data);
  }
}
