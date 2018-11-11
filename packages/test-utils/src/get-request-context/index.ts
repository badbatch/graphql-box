import { coreDefs } from "@handl/core";

export default function getRequestContext(props: coreDefs.PlainObjectMap = {}): coreDefs.RequestContext {
  return {
    fieldTypeMap: new Map(),
    filtered:  false,
    handlID: "123456789",
    operation: "query",
    operationName: "",
    ...props,
  };
}
