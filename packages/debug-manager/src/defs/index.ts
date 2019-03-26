import { DebugManagerDef } from "@handl/core";

export interface Logger {
  log(message?: any, ...optionalParams: any[]): void;
}

export interface UserOptions {
  logger?: Logger;
}

export type InitOptions = UserOptions;

export type ConstructorOptions = UserOptions;

export type DebugManagerInit = () => Promise<DebugManagerDef>;
