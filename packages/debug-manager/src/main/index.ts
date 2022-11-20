import { DebugManagerDef, LogData, LogEntry, LogLevel } from "@graphql-box/core";
import { deserializeError } from "@graphql-box/helpers";
import EventEmitter from "eventemitter3";
import { isString, pickBy } from "lodash";
import { Environment, Log, Performance, UserOptions } from "../defs";
import { deriveLogGroup, deriveLogOrder } from "../helpers/deriveLogProps";
import getEnvSpecificLabels from "../helpers/getEnvSpecificLabels";
import transformCachemapOptions from "../helpers/transformCachemapOptions";
import transformContext from "../helpers/transformContext";
import transformError from "../helpers/transformError";
import transformOptions from "../helpers/transformOptions";
import transformResult from "../helpers/transformResult";
import transformStats from "../helpers/transformStats";

export default class DebugManager extends EventEmitter implements DebugManagerDef {
  private _environment: Environment;
  private _log: Log | null;
  private _name: string;
  private _performance: Performance;

  constructor(options: UserOptions) {
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

  public handleLog(message: string, data: LogEntry, logLevel: LogLevel = "info") {
    if (data.err && !(data.err instanceof Error)) {
      data.err = deserializeError(data.err);
    }

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
          logGroup: deriveLogGroup(this._environment, message),
          logOrder: deriveLogOrder(message),
          ...transformCachemapOptions(cachemapOptions),
          ...transformContext(context),
          ...transformOptions(options),
          ...transformResult(result),
          ...transformStats(stats),
          ...getEnvSpecificLabels(this._environment),
          ...rest,
        },
        val => val !== undefined && val !== null && val !== "",
      ),
      log: {
        level: logLevel.toUpperCase(),
        logger: this._name,
      },
      ...transformError(this._environment, result),
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
