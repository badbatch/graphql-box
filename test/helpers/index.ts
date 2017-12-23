import { GraphQLSchema, IntrospectionQuery } from "graphql";
import * as introspectionQuery from "../introspection/index.json";
import { ClientArgs } from "../../src/types";

export const browserArgs: ClientArgs = {
  introspection: introspectionQuery as IntrospectionQuery,
  mode: "external",
  url: "https://api.github.com/graphql",
};

let graphqlSchema: GraphQLSchema | undefined;

if (!process.env.WEB_ENV) {
  graphqlSchema = require("../schema").default;
}

export const serverArgs: ClientArgs = {
  cachemapOptions: {
    dataObjects: { mockRedis: true },
    responses: { mockRedis: true },
  },
  mode: "internal",
  schema: graphqlSchema,
};
