import { PlainObjectMap } from "@graphql-box/core";
import { get } from "lodash";

const hasRequestPathChanged = (requestPath: string, data: PlainObjectMap | null | undefined) => {
  if (!data) {
    return false;
  }

  let slice = data;

  return requestPath.split(".").reduce((acc, key) => {
    if (acc) {
      return acc;
    }

    if (!(key in slice)) {
      return true;
    }

    slice = get(slice, key);
    return false;
  }, false);
};

export default hasRequestPathChanged;
