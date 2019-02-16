import { PlainObjectMap, RequestContext } from "@handl/core";

export default function getRequestContext(props: PlainObjectMap = {}): RequestContext {
  return {
    fieldTypeMap: new Map(),
    handlID: "123456789",
    operation: "query",
    operationName: "",
    queryFiltered: false,
    request: "",
    ...props,
  };
}
