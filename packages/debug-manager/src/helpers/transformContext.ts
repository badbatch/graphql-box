import { RequestContext } from "@graphql-box/core";

export default (context?: Omit<RequestContext, "debugManager">) => {
  if (!context) {
    return {};
  }

  const { fieldTypeMap, ...rest } = context;
  return rest;
};
