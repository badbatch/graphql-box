import registerPromiseWorker from "promise-worker/register";
import Client from "./client";
import { PostMessageArgs, RequestResult } from "./types";

let client: Client;

registerPromiseWorker(async (message: PostMessageArgs): Promise<RequestResult | RequestResult[] | undefined> => {
  debugger;
  const { args, opts, query, type } = message;

  let result: RequestResult | RequestResult[] | undefined;

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
          result = await client.request(query, opts);
          debugger;
        } catch (error) {
          return Promise.reject(error);
        }
      }
      break;
    default:
      // no default
  }

  return result;
});
