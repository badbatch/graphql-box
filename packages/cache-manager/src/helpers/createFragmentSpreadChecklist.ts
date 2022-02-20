import { getFragmentDefinitions } from "@graphql-box/helpers";
import { DocumentNode } from "graphql";
import { keys } from "lodash";

export type FragmentSpreadCheckist = {
  [key: string]: {
    deleted: number;
    paths: string[];
    total: number;
  };
};

export default (ast: DocumentNode) =>
  keys(getFragmentDefinitions(ast) ?? {}).reduce((acc: FragmentSpreadCheckist, name) => {
    acc[name] = { deleted: 0, paths: [], total: 0 };
    return acc;
  }, {});
