import { MaybeRequestResultWithDehydratedCacheMetadata } from "@graphql-box/core";
import { Response } from "express";

export default (res: Response, requestResult: MaybeRequestResultWithDehydratedCacheMetadata) => {
  const chunk = Buffer.from(JSON.stringify(requestResult), "utf8");

  const data = [
    "",
    "---",
    "Content-Type: application/json; charset=utf-8",
    "Content-Length: " + String(chunk.length),
    "",
    chunk,
    "",
  ].join("\r\n");

  res.write(data);
};
