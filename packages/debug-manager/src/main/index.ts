import { DebugManagerDef, LogData, LogLevel } from "@graphql-box/core";
import EventEmitter from "eventemitter3";
import { isPlainObject, isString, pickBy } from "lodash";
import { ConstructorOptions, DebugManagerInit, Environment, Log, Performance, UserOptions } from "../defs";
import { deriveLogGroup, deriveLogOrder } from "../helpers/deriveLogProps";
import transformCachemapOptions from "../helpers/transformCachemapOptions";
import transformContext from "../helpers/transformContext";
import transformError from "../helpers/transformError";
import transformOptions from "../helpers/transformOptions";
import transformResult from "../helpers/transformResult";
import transformStats from "../helpers/transformStats";

export class DebugManager extends EventEmitter implements DebugManagerDef {
  private _environment: Environment;
  private _log: Log | null;
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

    this._log = options.log ?? null;
    this._name = options.name;
    this._performance = options.performance;
    this._environment = options.environment ?? "client";
  }

  public handleLog(message: string, data: LogData, logLevel: LogLevel = "info") {
    this.emit("LOG", message, data);

    if (this._log) {
      this._log(message, data, logLevel);
    }
  }

  public log(message: string, data: LogData, logLevel: LogLevel = "info"): void {
    const { cachemapOptions, context, options, result, stats, ...rest } = data;

    const updatedData = {
      labels: pickBy(
        {
          environment: this._environment,
          logGroup: deriveLogGroup(this._environment),
          logOrder: deriveLogOrder(message),
          ...transformCachemapOptions(cachemapOptions),
          ...transformContext(context),
          ...transformOptions(options),
          ...transformResult(result),
          ...transformStats(stats),
          ...rest,
        },
        val => val !== undefined && val !== null && val !== "",
      ),
      log: {
        level: logLevel.toUpperCase(),
        logger: this._name,
      },
      ...transformError(result),
    };

    this.emit("LOG", message, updatedData);

    if (this._log) {
      this._log(message, updatedData, logLevel);
    }
  }

  public now(): number {
    return this._performance.now();
  }
}

export default function init(userOptions: UserOptions): DebugManagerInit {
  if (!isPlainObject(userOptions)) {
    throw new TypeError("@graphql-box/debug-manager expected userOptions to be a plain object.");
  }

  return () => new DebugManager(userOptions);
}
