import { RequestOptions } from "@graphql-box/core";

export default (options?: RequestOptions) => {
  if (!options) {
    return {};
  }

  const { fragments, variables, ...rest } = options;

  return {
    ...rest,
    ...(variables ? { variables: JSON.stringify(variables) } : {}),
  };
};
