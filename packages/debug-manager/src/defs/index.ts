import { coreDefs } from "@handl/core";
import EventEmitter from "eventemitter3";

export interface DebugManager extends EventEmitter {
  emit(event: string, props: coreDefs.PlainObjectMap): boolean;
}

export type DebugManagerInit = () => DebugManager;
