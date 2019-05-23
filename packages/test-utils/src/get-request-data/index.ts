import { RequestData } from "@graphql-box/core";
import { hashRequest } from "@graphql-box/helpers";
import { parse } from "graphql";

export default function getRequestData(request: string): RequestData {
  return {
    ast: parse(request),
    hash: hashRequest(request),
    request,
  };
}
