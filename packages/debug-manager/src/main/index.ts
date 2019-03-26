import { DebugManagerDef } from "@handl/core";
import EventEmitter from "eventemitter3";
import { isPlainObject } from "lodash";
import { ConstructorOptions, DebugManagerInit, InitOptions, Logger, UserOptions } from "../defs";
import performance from "../helpers/isomorphic-performance";

export class DebugManager extends EventEmitter implements DebugManagerDef {
  public static async init(options: InitOptions): Promise<DebugManager> {
    return new DebugManager(options);
  }

  private _logger: Logger | null;
  private _performance: Performance;

  constructor(options: ConstructorOptions) {
    super();
    const { logger } = options;
    this._logger = logger || null;
    this._performance = performance;
  }

  public emit(event: string, ...args: any[]): boolean {
    const hasListeners = super.emit(event, ...args);
    this._log(event, ...args);
    return hasListeners;
  }

  public now(): number {
    return this._performance.now();
  }

  private _log(message?: any, ...optionalParams: any[]): void {
    if (this._logger) this._logger.log(message, optionalParams);
  }
}

export default function init(userOptions: UserOptions): DebugManagerInit {
  if (userOptions && !isPlainObject(userOptions)) {
    throw new TypeError("@handl/debug-manager expected userOptions to be a plain object.");
  }

  return () => DebugManager.init(userOptions);
}
