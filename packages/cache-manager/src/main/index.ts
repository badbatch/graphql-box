import { isPlainObject } from "lodash";
import * as defs from "../defs";

export class CacheManager implements defs.CacheManager  {
  public static async init(options: defs.InitOptions): Promise<CacheManager> {
    try {
      // TODO
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default function init(userOptions: defs.UserOptions = {}): defs.CacheManagerInit {
  if (!isPlainObject(userOptions)) {
    throw new TypeError("@handl/cache-manager expected userOptions to be a plain object.");
  }

  return (clientOptions: defs.ClientOptions) => CacheManager.init({ ...clientOptions, ...userOptions });
}
