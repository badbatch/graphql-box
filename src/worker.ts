import { forAwaitEach, isAsyncIterable } from "iterall";
import registerPromiseWorker from "promise-worker/register";
import { ClientHandl } from "./client-handl";
import dehydrateCacheMetadata from "./helpers/dehydrate-cache-metadata";
import { PostMessageArgs, RequestResultData } from "./types";

if (process.env.TEST_ENV) {
  require("../test/mocks");
}

let client: ClientHandl;

registerPromiseWorker(async (message: PostMessageArgs): Promise<any> => {
  const { args, caches, key, opts, query, tag, type } = message;

  if (type === "create" && args) {
    try {
      client = await ClientHandl.create(args);
      return undefined;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  let result: any;

  try {
    switch (message.type) {
      case "clearCache":
        await client.clearCache();
        break;
      case "exportCaches":
        result = await client.exportCaches(tag);
        break;
      case "getDataEntityCacheEntry":
        if (key) result = await client.getDataEntityCacheEntry(key);
        break;
      case "getDataEntityCacheSize":
        result = await client.getDataEntityCacheSize();
        break;
      case "getQueryPathCacheEntry":
        if (key) result = await client.getQueryPathCacheEntry(key);
        break;
      case "getQueryPathCacheSize":
        result = await client.getQueryPathCacheSize();
        break;
      case "getResponseCacheEntry":
        if (key) {
          const entry = await client.getResponseCacheEntry(key);

          if (entry) {
            result = {
              cacheMetadata: dehydrateCacheMetadata(entry.cacheMetadata),
              data: entry.data,
            };
          }
        }
        break;
      case "getResponseCacheSize":
        result = await client.getResponseCacheSize();
        break;
      case "importCaches":
        if (caches) await client.importCaches(caches);
        break;
      case "request":
        if (query) {
          const requestResult = await client.request(query, opts);

          if (requestResult) {
            if (isAsyncIterable(requestResult)) {
              forAwaitEach(requestResult, (value) => {
                postMessage({ result: value, subscriptionID: key, type: "subscription" });
              });
            } else {
              const resolveResult = requestResult as RequestResultData;

              result = {
                ...resolveResult,
                cacheMetadata: dehydrateCacheMetadata(resolveResult.cacheMetadata),
              };
            }
          }
        }
        break;
      default:
        // no default
    }
  } catch (error) {
    return Promise.reject(error);
  }

  return result;
});
