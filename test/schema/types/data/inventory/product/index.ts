import { ObjectMap } from "../../../../../../src/types";

export default class ProductInventory {
  constructor(data: ObjectMap) {
    Object.assign(this, data);
  }
}
