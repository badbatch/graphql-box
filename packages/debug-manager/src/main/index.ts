import { DebugManagerDef, PlainObjectMap } from "@graphql-box/core";
import EventEmitter from "eventemitter3";
import { isPlainObject, isString } from "lodash";
import { ConstructorOptions, DebugManagerInit, Logger, Performance, UserOptions } from "../defs";

export class DebugManager extends EventEmitter implements DebugManagerDef {
  private _logger: Logger | null;
  private _name: string;
  private _performance: Performance;

  constructor(options: ConstructorOptions) {
    super();
    const errors: TypeError[] = [];

    if (!isString(options.name)) {
      errors.push(new TypeError("@graphql-box/debug-manager expected options.name to be a string."));
    }

    if (errors.length) {
      throw errors;
    }

    this._logger = options.logger || null;
    this._name = options.name;
    this._performance = options.performance;
  }

  public emit(event: string | symbol, data: PlainObjectMap): boolean {
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
    throw new TypeError("@graphql-box/debug-manager expected userOptions to be a plain object.");
  }

  return () => new DebugManager(userOptions);
}
