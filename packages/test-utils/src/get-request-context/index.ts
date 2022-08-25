import { PlainObjectMap, RequestContext } from "@graphql-box/core";

export default function getRequestContext(props: PlainObjectMap = {}): RequestContext {
  return {
    debugManager: null,
    fieldTypeMap: new Map(),
    hasDeferOrStream: false,
    operation: "query",
    operationName: "",
    queryFiltered: false,
    request: "",
    requestID: "123456789",
    whitelistHash: "",
    ...props,
  };
}
