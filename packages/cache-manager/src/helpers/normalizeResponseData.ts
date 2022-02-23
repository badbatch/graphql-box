import { RawResponseDataWithMaybeCacheMetadata } from "@graphql-box/core";
import { set } from "lodash";

export default ({ data, path, ...rest }: RawResponseDataWithMaybeCacheMetadata) => {
  return {
    ...rest,
    data: set({}, path as (string | number)[], data),
    path,
  };
};
