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

registerPromiseWorker(
  async (message: PostMessageArgs): Promise<PostMessageResult | PostMessageResult[] | undefined> => {
    const { args, opts, query, type } = message;

    let result: PostMessageResult | PostMessageResult[] | undefined;

    if (type === "create" && args) {
      client = await Client.create(args);
      return undefined;
    }

    switch (message.type) {
      case "clearCache":
        await client.clearCache();
        break;
      case "request":
        if (query) {
          try {
            const requestResult = await client.request(query, opts);

            if (requestResult) {
              result = convertCacheMetadata(requestResult);
            }
          } catch (error) {
            return Promise.reject(error);
          }
        }
        break;
      default:
        // no default
    }

    return result;
  },
);
