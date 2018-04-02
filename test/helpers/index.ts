import * as fetchMock from "fetch-mock";
import { IntrospectionQuery } from "graphql";
import { castArray, isArray, isString } from "lodash";
import * as md5 from "md5";
import { github } from "../data/graphql";
import { dataEndpoints, endpointData } from "../data/rest";
import * as githubIntrospection from "../introspection/github/index.json";
import * as ecomIntrospection from "../introspection/ecom/index.json";
import schema from "../schema";
import { ServerArgs } from "../../src/server-handl/types";
import { ClientArgs, ObjectMap } from "../../src/types";

export const browserClientArgs: ClientArgs = {
  fetchTimeout: 5000000,
  introspection: githubIntrospection as IntrospectionQuery,
  newInstance: true,
  url: "https://api.github.com/graphql",
};

export const workerClientArgs: ClientArgs = {
  fetchTimeout: 5000000,
  introspection: githubIntrospection as IntrospectionQuery,
  newInstance: true,
  url: "https://api.github.com/graphql",
};

export const serverClientArgs: ClientArgs = {
  cachemapOptions: { mockRedis: true },
  fetchTimeout: 5000000,
  introspection: ecomIntrospection as IntrospectionQuery,
  newInstance: true,
  url: "http://localhost:3001/graphql",
};

export const subscriptionClientArgs: ClientArgs = {
  cachemapOptions: { mockRedis: true },
  fetchTimeout: 5000000,
  introspection: ecomIntrospection as IntrospectionQuery,
  newInstance: true,
  subscriptions: { address: "ws://localhost:3001/graphql" },
  url: "http://localhost:3001/graphql",
};

export const serverArgs: ServerArgs = {
  cachemapOptions: { mockRedis: true },
  newInstance: true,
  schema,
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
  const matcher = (url: string): boolean => url === `https://www.ecom.com/direct/rest/${path}`;
  const body = getRestResponse(key, resource);
  fetchMock.get(matcher, { body: JSON.stringify(body) });
  return { body, path };
}

export function stripSpaces(request: string): string {
  return request.replace(/\s/g, "");
}

export function getGraphqlResponse(requestHash: string): ObjectMap | undefined {
  const keys = Object.keys(github.requests);

  for (const key of keys) {
    const request = github.requests[key];
    if (!request) continue;

    if (md5(stripSpaces(request)) === requestHash) {
      return github.responses[key];
    }
  }

  return undefined;
}

export function mockGraphqlRequest(request: string): { body: ObjectMap } {
  const requestHash = md5(stripSpaces(request));

  const matcher = (url: string, opts: fetchMock.MockRequest): boolean => {
    const _opts = opts as RequestInit;
    const parsedBody = JSON.parse(_opts.body as string);
    if (!isString(parsedBody.query)) return false;
    return md5(stripSpaces(parsedBody.query)) === requestHash;
  };

  const body = getGraphqlResponse(requestHash) as ObjectMap;
  const headers = { "cache-control": "public, max-age=300000, s-maxage=300000" };
  fetchMock.post(matcher, { body, headers });
  return { body };
}
