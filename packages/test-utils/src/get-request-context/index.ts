import { PlainObjectMap, RequestContext } from "@graphql-box/core";

export default function getRequestContext(props: PlainObjectMap = {}): RequestContext {
  return {
    debugManager: null,
    fieldTypeMap: new Map(),
    filteredRequest: "",
    hasDeferOrStream: false,
    operation: "query",
    operationName: "",
    parsedRequest: "",
    queryFiltered: false,
    request: "",
    requestComplexity: null,
    requestDepth: null,
    requestID: "123456789",
    whitelistHash: "",
    ...props,
  };
}
