import { coreDefs } from "@handl/core";
import EventEmitter from "eventemitter3";

export interface DebugManager extends EventEmitter {
  emit(event: string, props: coreDefs.PlainObjectMap): boolean;
  now(): number;
}

export type DebugManagerInit = () => DebugManager;
