import { DebugManagerDef, PlainObjectMap } from "@handl/core";
import EventEmitter from "eventemitter3";
import { isPlainObject, isString } from "lodash";
import { ConstructorOptions, DebugManagerInit, InitOptions, Logger, UserOptions } from "../defs";

export class DebugManager extends EventEmitter implements DebugManagerDef {
  public static async init(options: InitOptions): Promise<DebugManager> {
    const errors: TypeError[] = [];

    if (!isString(options.name)) {
       errors.push(new TypeError("@handl/debug-manager expected options.name to be a string."));
    }

    if (errors.length) return Promise.reject(errors);

    return new DebugManager(options);
  }

  private _logger: Logger | null;
  private _name: string;
  private _performance: Performance;

  constructor({ logger, name, performance }: ConstructorOptions) {
    super();
    this._logger = logger || null;
    this._name = name;
    this._performance = performance;
  }

  public emit(event: string, data: PlainObjectMap): boolean {
    const updatedData = { ...data, debuggerName: this._name };
    const hasListeners = super.emit(event, updatedData);
    this._log(event, updatedData);
    return hasListeners;
  }

  public now(): number {
    return this._performance.now();
  }

  private _log(message: any, data: PlainObjectMap): void {
    if (this._logger) this._logger.log(message, data);
  }
}

export default function init(userOptions: UserOptions): DebugManagerInit {
  if (!isPlainObject(userOptions)) {
    throw new TypeError("@handl/debug-manager expected userOptions to be a plain object.");
  }

  return () => DebugManager.init(userOptions);
}
