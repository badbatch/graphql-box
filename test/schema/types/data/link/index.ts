import { ObjectMap } from "../../../../../src/types";

export default class Link {
  constructor(data: ObjectMap) {
    Object.assign(this, data);
  }
}
