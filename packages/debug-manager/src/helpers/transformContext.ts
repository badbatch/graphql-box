import { RequestContext } from "@graphql-box/core";

export default (context: Omit<RequestContext, "debugManager">) => {
  const { fieldTypeMap, ...rest } = context;
  return rest;
};
