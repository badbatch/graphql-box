import registerPromiseWorker from "promise-worker/register";
import Client from "./client";
import { PostMessageArgs, PostMessageResult, RequestResult } from "./types";

let client: Client;

registerPromiseWorker(async (message: PostMessageArgs): Promise<PostMessageResult> => {
  const { args, opts, query, type } = message;

  let result: RequestResult | RequestResult[] | undefined;

  if (type === "create" && args) {
    client = await Client.create(args);
    return result;
  }

  switch (message.type) {
    case "clearCache":
      await client.clearCache();
      break;
    case "request":
      if (query) result = await client.request(query, opts);
      break;
    default:
      // no default
  }

  return result;
});
