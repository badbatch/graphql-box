import { forAwaitEach, isAsyncIterable } from "iterall";
import registerPromiseWorker from "promise-worker/register";
import { DefaultClient } from "./default-client";
import mapToObject from "./helpers/map-to-object";
import { PostMessageArgs, PostMessageResult, RequestResultData } from "./types";

if (process.env.TEST_ENV) {
  require("../test/mocks");
}

function convertCacheMetadata({ cacheMetadata, ...otherProps }: RequestResultData): PostMessageResult {
  const postMessageResult: PostMessageResult = { ...otherProps };
  if (cacheMetadata) postMessageResult.cacheMetadata = mapToObject(cacheMetadata);
  return postMessageResult;
}

let client: DefaultClient;

registerPromiseWorker(async (message: PostMessageArgs): Promise<any> => {
  const { args, key, opts, query, type } = message;

  if (type === "create" && args) {
    try {
      client = await DefaultClient.create(args);
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
      case "getDataEntityCacheEntry":
        if (key) {
          result = await client.getDataEntityCacheEntry(key);
        }
        break;
      case "getDataEntityCacheSize":
        result = await client.getDataEntityCacheSize();
        break;
      case "getDataPathCacheEntry":
        if (key) {
          result = await client.getDataPathCacheEntry(key);
        }
        break;
      case "getDataPathCacheSize":
        result = await client.getDataPathCacheSize();
        break;
      case "getResponseCacheEntry":
        if (key) {
          const entry = await client.getResponseCacheEntry(key);

          if (entry) {
            result = {
              cacheMetadata: mapToObject(entry.cacheMetadata),
              data: entry.data,
            };
          }
        }
        break;
      case "getResponseCacheSize":
        result = await client.getResponseCacheSize();
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
              result = convertCacheMetadata(resolveResult);
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
