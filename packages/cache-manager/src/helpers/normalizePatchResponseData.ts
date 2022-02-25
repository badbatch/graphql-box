import { RawResponseDataWithMaybeCacheMetadata } from "@graphql-box/core";
import { set } from "lodash";

export default ({ data, paths, ...rest }: RawResponseDataWithMaybeCacheMetadata) => {
  return {
    ...rest,
    data: set({}, (paths as string[])[0], data),
    paths,
  };
};
