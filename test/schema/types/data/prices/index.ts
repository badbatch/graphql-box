import { ObjectMap } from "../../../../../src/types";

export default class Prices {
  constructor(data: ObjectMap) {
    Object.assign(this, data);
  }
}
