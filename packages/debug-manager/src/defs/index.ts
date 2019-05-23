import { DebugManagerDef } from "@graphql-box/core";

export interface Logger {
  log(message?: any, ...optionalParams: any[]): void;
}

export interface UserOptions {
  /**
   * The logger to use.
   */
  logger?: Logger;

  /**
   * The name of the debug manager. This is used
   * to distinguish the logs of multiple debug managers.
   */
  name: string;

  /**
   * The performance object to use for measuring method
   * execution speeds.
   */
  performance: Performance;
}

export type InitOptions = UserOptions;

export type ConstructorOptions = UserOptions;

export type DebugManagerInit = () => Promise<DebugManagerDef>;

export interface Performance {
  now(): number;
}
