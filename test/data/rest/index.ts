import { castArray, isArray } from "lodash";
import { ObjectMap } from "../../../src/types";

export interface DataType {
  [key: string]: ObjectMap;
}

export const accessoriesData: DataType = {};
export const inventoryProductData: DataType = {};
export const inventorySkuData: DataType = {};

export const productData: DataType = {
  "402-5806": require("./responses/product/402-5806.json"),
  "522-7645": require("./responses/product/522-7645.json"),
};

export const rangeData: DataType = {};

export const skuData: DataType = {
  "104-7702": require("./responses/sku/104-7702.json"),
};

export const endpointData: { [key: string]: DataType } = {
  accessoriesData,
  inventoryProductData,
  inventorySkuData,
  productData,
  rangeData,
  skuData,
};

export const dataEndpoints: { [key: string]: string } = {
  accessories: "content/relationships/accessories",
  inventoryProduct: "inventory/product",
  inventorySku: "inventory/sku",
  product: "content/catalog/product",
  range: "content/relationships/range",
  sku: "content/catalog/sku",
};

export function buildRestPath(key: string, resource: string | string[]): string {
  const castResource = castArray(resource);
  const path = dataEndpoints[key];
  return isArray(resource) ? `${path}/${castResource.join()}` : `${path}/${resource}`;
}

export function getRestResponse(key: string, resource: string | string[]): ObjectMap | ObjectMap[] {
  const castResource = castArray(resource);
  const data = endpointData[`${key}Data`];
  const response: ObjectMap[] = [];

  castResource.forEach((value) => {
    if (!data[value]) return;
    response.push(data[value]);
  });

  return isArray(resource) ? response : response[0];
}
