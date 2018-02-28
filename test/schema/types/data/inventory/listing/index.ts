import { ObjectMap } from "../../../../../../src/types";

export default class ListingInventory {
  constructor(data: ObjectMap) {
    Object.assign(this, data);
  }
}
