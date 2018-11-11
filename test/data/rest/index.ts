import * as defs from "../../defs";

export const accessoriesData: defs.DataType = {};
export const inventoryProductData: defs.DataType = {};
export const inventorySkuData: defs.DataType = {};

export const productData: defs.DataType = {
  "402-5806": require("./responses/product/402-5806.json"),
  "522-7645": require("./responses/product/522-7645.json"),
};

export const rangeData: defs.DataType = {};

export const skuData: defs.DataType = {
  "104-7702": require("./responses/sku/104-7702.json"),
  "134-5203": require("./responses/sku/134-5203.json"),
};

export const endpointData: { [key: string]: defs.DataType } = {
  accessoriesData,
  inventoryProductData,
  inventorySkuData,
  productData,
  rangeData,
  skuData,
};

export const dataEndpoints: defs.PlainObjectStringMap = {
  accessories: "content/relationships/accessories",
  inventoryProduct: "inventory/product",
  inventorySku: "inventory/sku",
  product: "content/catalog/product",
  range: "content/relationships/range",
  sku: "content/catalog/sku",
};
