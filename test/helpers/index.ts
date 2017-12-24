import * as fetchMock from "fetch-mock";
import { GraphQLSchema, IntrospectionQuery } from "graphql";
import { castArray, isArray } from "lodash";
import * as md5 from "md5";
import { github } from "../data/graphql";
import { dataEndpoints, endpointData } from "../data/rest";
import * as introspectionQuery from "../introspection/index.json";
import { ClientArgs, ObjectMap } from "../../src/types";

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
    dataObjects: {
      mockRedis: true,
      redisOptions: { fast: true },
    },
    responses: {
      mockRedis: true,
      redisOptions: { fast: true },
    },
  },
  mode: "internal",
  schema: graphqlSchema,
};

export function buildRestPath(key: string, resource: string | string[]): string {
  const castResource = castArray(resource);
  const path = dataEndpoints[key];
  return isArray(resource) ? `${path}/${castResource.join()}` : `${path}/${resource}`;
}

export function getRestResponse(key: string, resource: string | string[]): ObjectMap | ObjectMap[] {
  const castResource = castArray(resource);
  const data = endpointData[`${key}Data`];
  const response: ObjectMap[] = [];

  castResource.forEach((value) => {
    if (!data[value]) return;
    response.push(data[value]);
  });

  return isArray(resource) ? response : response[0];
}

export function mockRestRequest(key: string, resource: string | string[]): { body: ObjectMap, path: string } {
  const path = buildRestPath(key, resource);
  const matcher = (url: string): boolean => url === `https://www.tesco.com/direct/rest/${path}`;
  const body = getRestResponse(key, resource);
  fetchMock.mock(matcher, { body: JSON.stringify(body) });
  return { body, path };
}

export function getGraphqlResponse(hash: string): ObjectMap | undefined {
  const keys = Object.keys(github.requests);

  for (const key of keys) {
    const request = github.requests[key];
    if (!request) continue;
    const requestHash = md5(request.replace(/\s/g, ""));

    if (requestHash === hash) {
      return github.responses[key];
    }
  }

  return undefined;
}
