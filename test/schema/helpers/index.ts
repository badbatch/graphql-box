import { castArray, flatten, isArray, isPlainObject } from "lodash";
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
  const output: ObjectMap[] = [];

  data.forEach((value) => {
    output.push({ ...value, _metadata });
  });

  return data;
}

export function getLinks({ links }: { links: ObjectMap[] }, relation: string): ObjectMap[] {
  return links.filter(({ rel }) => rel === relation);
}

export interface QueryDatabaseArgs {
  cmd: string;
  key?: string;
  type: string;
  value?: any;
  callback?: (dataType: ObjectMap, value: any, key?: any) => any;
}

let database: ObjectMap = {};

export function clearDatabase(): void {
  database = {};
}

export function queryDatabase({ callback, cmd, key, type, value }: QueryDatabaseArgs): any {
  if (!database[type]) database[type] = {};
  let dataType = database[type];
  let result: any;
  const _metadata = { cacheControl: `public, max-age=60` };

  switch (cmd) {
    case "get":
      result = key ? dataType[key] : dataType;
      if (isPlainObject(result)) result = { ...result, _metadata };
      break;
    case "set":
      if (value && !callback) {
        if (key) {
          dataType[key] = value;
        } else {
          dataType = value;
        }
      } else if (value && callback) {
        callback(dataType, value, key);
      }
      break;
    default:
      // no default
  }

  return result;
}
