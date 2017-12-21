import { ObjectMap } from "../../../../../src/types";

export default class Product {
  constructor(data: ObjectMap) {
    Object.assign(this, data);
  }
}
