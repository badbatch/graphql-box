import { coreDefs } from "@cachemap/core";
import { PlainObjectStringMap } from "@handl/core";

export interface InitClientOptions {
  cachemapStore: coreDefs.StoreInit;
  debuggerName?: string;
  typeCacheDirectives: PlainObjectStringMap;
}

export interface InitWorkerClientOptions {
  worker: Worker;
}
