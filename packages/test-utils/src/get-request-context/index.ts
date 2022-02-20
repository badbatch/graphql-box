import { PlainObjectMap, RequestContext } from "@graphql-box/core";

export default function getRequestContext(props: PlainObjectMap = {}): RequestContext {
  return {
    boxID: "123456789",
    debugManager: null,
    fieldTypeMap: new Map(),
    hasDeferOrStream: false,
    operation: "query",
    operationName: "",
    queryFiltered: false,
    request: "",
    ...props,
  };
}
