import { ObjectMap } from "../../../../../src/types";

export default class Sku {
  constructor(data: ObjectMap) {
    Object.assign(this, data);
  }
}
