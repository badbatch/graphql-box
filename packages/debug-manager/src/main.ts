import { type DebugManagerDef, type LogData, type LogEntry, type LogLevel } from '@graphql-box/core';
import { ArgsError, GroupedError, deserializeError } from '@graphql-box/helpers';
import { EventEmitter } from 'eventemitter3';
import { isString, pickBy } from 'lodash-es';
import { deriveLogGroup, deriveLogOrder } from './helpers/deriveLogProps.ts';
import { getEnvSpecificLabels } from './helpers/getEnvSpecificLabels.ts';
import { transformCachemapOptions } from './helpers/transformCachemapOptions.ts';
import { transformContext } from './helpers/transformContext.ts';
import { transformError } from './helpers/transformError.ts';
import { transformOptions } from './helpers/transformOptions.ts';
import { transformResult } from './helpers/transformResult.ts';
import { transformStats } from './helpers/transformStats.ts';
import { type Environment, type Log, type Performance, type UserOptions } from './types.ts';

export class DebugManager extends EventEmitter implements DebugManagerDef {
  private _environment: Environment;
  private _log: Log | null;
  private _name: string;
  private _performance: Performance;

  constructor(options: UserOptions) {
    super();
    const errors: ArgsError[] = [];

    if (!isString(options.name)) {
      errors.push(new ArgsError('@graphql-box/debug-manager expected options.name to be a string.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@graphql-box/debug-manager argument validation errors.', errors);
    }

    this._log = options.log ?? null;
    this._name = options.name;
    this._performance = options.performance;
    this._environment = options.environment ?? 'client';
  }

  public handleLog(message: string, data: LogEntry, logLevel: LogLevel = 'info') {
    if (data.err && !(data.err instanceof Error)) {
      data.err = deserializeError(data.err);
    }

    this.emit('LOG', message, data);

    if (this._log) {
      this._log(message, data, logLevel);
    }
  }

  public log(message: string, data: LogData, logLevel: LogLevel = 'info'): void {
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
        value => value !== undefined && value !== null && value !== '',
      ),
      log: {
        level: logLevel.toUpperCase(),
        logger: this._name,
      },
      ...transformError(this._environment, result),
    };

    this.emit('LOG', message, updatedData);

    if (this._log) {
      this._log(message, updatedData, logLevel);
    }
  }

  public now(): number {
    return this._performance.now();
  }
}
