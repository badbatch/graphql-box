import * as fetchMock from "fetch-mock";
import { IntrospectionQuery } from "graphql";
import { castArray, isArray, isString } from "lodash";
import * as md5 from "md5";
import { github } from "../data/graphql";
import { dataEndpoints, endpointData } from "../data/rest";
import * as githubIntrospection from "../introspection/github/index.json";
import * as tescoIntrospection from "../introspection/tesco/index.json";
import { ClientArgs, ObjectMap } from "../../src/types";

export const browserArgs: ClientArgs = {
  fetchTimeout: 5000000,
  introspection: githubIntrospection as IntrospectionQuery,
  newInstance: true,
  url: "https://api.github.com/graphql",
};

export const workerArgs: ClientArgs = {
  fetchTimeout: 5000000,
  introspection: githubIntrospection as IntrospectionQuery,
  newInstance: true,
  url: "https://api.github.com/graphql",
};

export const serverArgs: ClientArgs = {
  cachemapOptions: {
    dataEntities: { mockRedis: true },
    dataPaths: { mockRedis: true },
    responses: { mockRedis: true },
  },
  fetchTimeout: 5000000,
  introspection: tescoIntrospection as IntrospectionQuery,
  newInstance: true,
  url: "http://localhost:3001/graphql",
};

export const subscriptionArgs: ClientArgs = {
  cachemapOptions: {
    dataEntities: { mockRedis: true },
    dataPaths: { mockRedis: true },
    responses: { mockRedis: true },
  },
  fetchTimeout: 5000000,
  introspection: tescoIntrospection as IntrospectionQuery,
  newInstance: true,
  subscriptions: { address: "ws://localhost:3001" },
  url: "http://localhost:3001/graphql",
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
