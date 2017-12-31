import * as fetchMock from "fetch-mock";
import { GraphQLSchema, IntrospectionQuery } from "graphql";
import { castArray, isArray } from "lodash";
import * as md5 from "md5";
import { github } from "../data/graphql";
import { dataEndpoints, endpointData } from "../data/rest";
import * as introspectionQuery from "../introspection/index.json";
import { ClientArgs, ObjectMap } from "../../src/types";

export const browserArgs: ClientArgs = {
  cachemapOptions: {
    dataEntities: { use: { client: "localStorage" } },
    dataPaths: { use: { client: "localStorage" } },
    responses: { use: { client: "localStorage" } },
  },
  introspection: introspectionQuery as IntrospectionQuery,
  mode: "external",
  newInstance: true,
  url: "https://api.github.com/graphql",
};

export const workerArgs: ClientArgs = {
  introspection: introspectionQuery as IntrospectionQuery,
  mode: "external",
  newInstance: true,
  url: "https://api.github.com/graphql",
};

let graphqlSchema: GraphQLSchema | undefined;

if (!process.env.WEB_ENV) {
  graphqlSchema = require("../schema").default;
}

export const serverArgs: ClientArgs = {
  cachemapOptions: {
    dataEntities: { mockRedis: true },
    dataPaths: { mockRedis: true },
    responses: { mockRedis: true },
  },
  mode: "internal",
  newInstance: true,
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

export function getGraphqlResponse(requestHash: string): ObjectMap | undefined {
  const keys = Object.keys(github.requests);

  for (const key of keys) {
    const request = github.requests[key];
    if (!request) continue;

    if (md5(request.replace(/\s/g, "")) === requestHash) {
      return github.responses[key];
    }
  }

  return undefined;
}

export function mockGraphqlRequest(request: string): { body: ObjectMap } {
  const requestHash = md5(request.replace(/\s/g, ""));

  const matcher = (url: string, opts: fetchMock.MockRequest): boolean => {
    const _opts = opts as RequestInit;
    const parsedBody = JSON.parse(_opts.body);
    return md5(parsedBody.query.replace(/\s/g, "")) === requestHash;
  };

  const body = getGraphqlResponse(requestHash) as ObjectMap;
  const headers = { "cache-control": "public, max-age=300000, s-maxage=300000" };
  fetchMock.mock(matcher, { body, headers });
  return { body };
}
