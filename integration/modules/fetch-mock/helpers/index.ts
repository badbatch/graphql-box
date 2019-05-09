import { PlainObjectMap } from "@handl/core";
import fetchMock from "fetch-mock";
import { cloneDeepWith } from "lodash";
import { URL } from "../../../consts";
import { HEADERS } from "../consts";
import { MockRequestOptions } from "../defs";

function buildRequestURL(hash?: string): string {
  if (!hash) return "*";
  return `${URL}?requestId=${hash}`;
}

export function mockRequest({ data, hash }: MockRequestOptions): void {
  const body = { data };
  const headers = { "cache-control": "public, max-age=5" };
  fetchMock.post(buildRequestURL(hash), { body, headers });
}

export function dehydrateFetchMock(data: PlainObjectMap | any[]): PlainObjectMap {
  return cloneDeepWith(data, (value: any) => {
    if (!(value instanceof Headers)) return undefined;

    const entries = [...value.entries()];

    return entries.reduce((acc: PlainObjectMap, [key, val]) => {
      acc[key] = val;
      return acc;
    }, {});
  });
}

export function rehydrateFetchMock(data: PlainObjectMap | any[]): PlainObjectMap {
  return cloneDeepWith(data, (value: any, key: string | number | undefined) => {
    if (key !== HEADERS) return undefined;

    return new Headers(value);
  });
}
