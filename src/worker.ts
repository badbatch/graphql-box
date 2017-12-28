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

  let result: any;

  if (type === "create" && args) {
    client = await Client.create(args);
    return undefined;
  }

  switch (message.type) {
    case "clearCache":
      await client.clearCache();
      break;
    case "getDataObjectCacheEntry":
      if (key) {
        result = await client.getDataObjectCacheEntry(key);
      }
      break;
    case "getDataObjectCacheSize":
      result = await client.getDataObjectCacheSize();
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
