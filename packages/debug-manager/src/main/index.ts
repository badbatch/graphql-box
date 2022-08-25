import { DebugManagerDef, PlainObjectMap } from "@graphql-box/core";
import EventEmitter from "eventemitter3";
import { isPlainObject, isString } from "lodash";
import {
  ConstructorOptions,
  DebugManagerInit,
  DebugManagerLocation,
  LogLevel,
  Logger,
  Performance,
  UserOptions,
} from "../defs";
import deriveLogOrder from "../helpers/deriveLogOrder";

export class DebugManager extends EventEmitter implements DebugManagerDef {
  private _location: DebugManagerLocation;
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

    this._logger = options.logger ?? null;
    this._name = options.name;
    this._performance = options.performance;
    this._location = options.location ?? "client";
  }

  public emit(event: string | symbol, data: PlainObjectMap, logLevel: LogLevel = "info"): boolean {
    const updatedData = {
      ...data,
      debuggerName: this._name,
      logGroup: this._deriveLogGroup(),
      logOrder: deriveLogOrder(event),
      timestamp: this._performance.now(),
    };

    const hasListeners = super.emit(event, updatedData, logLevel);
    this._log(event, updatedData, logLevel);
    return hasListeners;
  }

  public now(): number {
    return this._performance.now();
  }

  private _deriveLogGroup() {
    switch (this._location) {
      case "server":
        return 3;

      case "workerClient":
        return 1;

      default:
        return 2;
    }
  }

  private _log(message: any, data: PlainObjectMap, logLevel?: LogLevel): void {
    if (this._logger) {
      this._logger.log(message, data, logLevel);
    }
  }
}

export default function init(userOptions: UserOptions): DebugManagerInit {
  if (!isPlainObject(userOptions)) {
    throw new TypeError("@graphql-box/debug-manager expected userOptions to be a plain object.");
  }

  return () => new DebugManager(userOptions);
}
