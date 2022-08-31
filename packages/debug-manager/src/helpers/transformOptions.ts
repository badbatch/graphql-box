import { RequestOptions } from "@graphql-box/core";

export default (options?: RequestOptions) => {
  if (!options) {
    return {};
  }

  const { fragments, ...rest } = options;
  return rest;
};
