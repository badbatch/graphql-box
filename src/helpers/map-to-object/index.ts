import Cacheability from "cacheability";
import { ObjectMap } from "../../types";

export default function mapToObject(map: Map<any, Cacheability>): ObjectMap {
  const obj: ObjectMap = {};

  map.forEach((cacheability, key) => {
    obj[key] = cacheability.metadata;
  });

  return obj;
}
