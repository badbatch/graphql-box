import { ObjectMap } from "../../../../../src/types";

export default class Inventory {
  constructor(data: ObjectMap) {
    Object.assign(this, data);
  }
}
