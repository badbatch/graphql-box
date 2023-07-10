import { RequestContext, RequestData, RequestOptions, ResponseMock } from "@graphql-box/core";
import { isFunction } from "lodash";
import { SetOptional } from "type-fest";

export const getMockedResponse = (
  requestData: SetOptional<RequestData, "ast">,
  options: RequestOptions,
  context: Partial<RequestContext>,
  mocks: Record<string, ResponseMock>,
) => {
  const { hash } = requestData;

  if (hash in mocks) {
    const mock = mocks[hash];
    return isFunction(mock) ? mock(requestData, options, context) : mock;
  }

  const { originalRequestHash } = context;

  if (originalRequestHash && originalRequestHash in mocks) {
    const mock = mocks[originalRequestHash];
    return isFunction(mock) ? mock(requestData, options, context) : mock;
  }

  return undefined;
};
