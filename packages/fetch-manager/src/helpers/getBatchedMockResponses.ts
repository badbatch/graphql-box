import { RequestContext, ResponseMock } from "@graphql-box/core";
import { JsonValue } from "type-fest";
import { BatchedMaybeFetchData } from "../defs";
import { getMockedResponse } from "./getMockedResponse";

export const getBatchedMockedResponses = (
  batchRequests: Record<string, JsonValue>,
  mocks: Record<string, ResponseMock>,
): BatchedMaybeFetchData | undefined => {
  const responses = Object.keys(batchRequests).reduce((acc, requestHash) => {
    const { request, context } = batchRequests[requestHash] as {
      context: Pick<RequestContext, "operation" | "originalRequestHash" | "requestID">;
      request: string;
    };

    return { ...acc, [requestHash]: getMockedResponse({ request, hash: requestHash }, {}, context, mocks) };
  }, {});

  if (!Object.keys(responses).length) {
    return undefined;
  }

  return {
    headers: new Headers(),
    responses,
  };
};
