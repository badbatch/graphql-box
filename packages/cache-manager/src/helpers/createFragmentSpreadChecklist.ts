import { RequestData } from "@graphql-box/core";
import { keys } from "lodash";
import { CacheManagerContext } from "../defs";

export type FragmentSpreadCheckist = {
  [key: string]: {
    deleted: number;
    paths: string[];
    total: number;
  };
};

export default ({ request }: RequestData, { fragmentDefinitions }: CacheManagerContext) =>
  keys(fragmentDefinitions ?? {}).reduce((acc: FragmentSpreadCheckist, name) => {
    acc[name] = { deleted: 0, paths: [], total: (request.match(new RegExp(`\\.\\.\\.${name}`, "g")) || []).length };
    return acc;
  }, {});
