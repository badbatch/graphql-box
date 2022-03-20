import { RequestData } from "@graphql-box/core";
import { getFragmentDefinitions } from "@graphql-box/helpers";
import { keys } from "lodash";

export type FragmentSpreadCheckist = {
  [key: string]: {
    deleted: number;
    paths: string[];
    total: number;
  };
};

export default ({ ast, request }: RequestData) =>
  keys(getFragmentDefinitions(ast) ?? {}).reduce((acc: FragmentSpreadCheckist, name) => {
    acc[name] = { deleted: 0, paths: [], total: (request.match(new RegExp(`\\.\\.\\.${name}`, "g")) || []).length };
    return acc;
  }, {});
