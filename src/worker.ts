import { castArray, isArray } from "lodash";
import registerPromiseWorker from "promise-worker/register";
import Client from "./client";
import mapToObject from "./helpers/map-to-object";
import { PostMessageArgs, PostMessageResult, RequestResult } from "./types";

if (process.env.TEST_ENV) {
  require("../test/mocks");
}

function convertCacheMetadata(result: RequestResult | RequestResult[]): PostMessageResult | PostMessageResult[] {
  const requestResults = castArray(result);
  const postMessageResults: PostMessageResult[] = [];

  requestResults.forEach(({ cacheMetadata, ...otherProps }) => {
    postMessageResults.push({ cacheMetadata: mapToObject(cacheMetadata), ...otherProps });
  });

  return isArray(result) ? postMessageResults : postMessageResults[0];
}

let client: Client;

registerPromiseWorker(async (message: PostMessageArgs): Promise<any> => {
  const { args, key, opts, query, type } = message;

  if (type === "create" && args) {
    client = await Client.create(args);
    return undefined;
  }

  let result: any;

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
          result = { cacheMetadata: mapToObject(entry.cacheMetadata), data: entry.data };
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
          result = convertCacheMetadata(requestResult);
        }
      }
      break;
    default:
      // no default
  }

  return result;
});
