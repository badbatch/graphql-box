import { coreDefs } from "@handl/core";

export interface RequestAndOptions {
  options?: coreDefs.PlainObjectMap;
  request: string;
}
