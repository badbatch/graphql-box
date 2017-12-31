import { castArray, flatten, isArray } from "lodash";
import { dataEndpoints } from "../../data/rest";
import { ObjectMap } from "../../../src/types";

const tescoBaseURL = "https://www.tesco.com/direct/rest/";

function buildURLs(
  args: ObjectMap,
  key: string,
  opts: { batch?: boolean } = {},
): string[] {
  const path = dataEndpoints[key];
  const resource: string[] = castArray(args.id);
  const urls: string[] = [];

  if (!isArray(args.id) || opts.batch) {
    urls.push(`${tescoBaseURL}${path}/${resource.join()}`);
  } else {
    resource.forEach((value) => {
      urls.push(`${tescoBaseURL}${path}/${value}`);
    });
  }

  return urls;
}

async function _fetch(url: string): Promise<ObjectMap> {
  const res = await fetch(url);
  return res.json();
}

export async function fetchData(
  key: string,
  args: ObjectMap,
  opts: { batch?: boolean } = {},
): Promise<ObjectMap | ObjectMap[]> {
  const urls = buildURLs(args, key, opts);
  const promises: Array<Promise<ObjectMap>> = [];

  urls.forEach((value) => {
    promises.push(_fetch(value));
  });

  const data: ObjectMap[] = flatten(await Promise.all(promises));
  const maxAge = key === "product" ? 28800 : 14400;
  const _metadata = { cacheControl: `public, max-age=${maxAge}` };
  if (!isArray(args.id)) return { ...data[0], _metadata };
  return [{ ...data[0], _metadata }, { ...data[1], _metadata }];
}

export function getLinks({ links }: { links: ObjectMap[] }, relation: string): ObjectMap[] {
  return links.filter(({ rel }) => rel === relation);
}
