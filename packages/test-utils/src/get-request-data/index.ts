import { hashRequest, RequestData } from "@handl/core";
import { parse } from "graphql";

export default function getRequestData(request: string): RequestData {
  return {
    ast: parse(request),
    hash: hashRequest(request),
    request,
  };
}
