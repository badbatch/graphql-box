import { PlainObjectMap } from "@handl/core";
import EventEmitter from "eventemitter3";

export interface DebugManagerDef extends EventEmitter {
  emit(event: string, props: PlainObjectMap): boolean;
  now(): number;
}

export type DebugManagerInit = () => DebugManagerDef;
