import { coreDefs } from "@cachemap/core";
import { PlainObjectMap, PlainObjectStringMap } from "@handl/core";

export interface InitClientOptions {
  cachemapStore: coreDefs.StoreInit;
  debuggerName?: string;
  typeCacheDirectives: PlainObjectStringMap;
}

export interface InitWorkerClientOptions {
  worker: Worker;
}

export interface MockRequestOptions {
  data: PlainObjectMap;
  hash?: string;
}
