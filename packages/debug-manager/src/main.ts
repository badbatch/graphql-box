import {
  type DebugManagerDef,
  type GraphqlEnv,
  type GraphqlStep,
  type LogData,
  type LogLevel,
} from '@graphql-box/core';
import { ArgsError, GroupedError } from '@graphql-box/helpers';
import { EventEmitter } from 'eventemitter3';
import { isString } from 'lodash-es';
import { type Log, type Performance, type UserOptions } from './types.ts';

export class DebugManager extends EventEmitter implements DebugManagerDef {
  private readonly _environment: GraphqlEnv;
  private readonly _log: Log | null;
  private readonly _name: string;
  private readonly _performance: Performance;

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

  public handleLog(message: GraphqlStep, data: LogData, logLevel: LogLevel = 'info') {
    this.emit('LOG', message, data);

    if (this._log) {
      this._log(message, data, logLevel);
    }
  }

  public log(message: GraphqlStep, logData: LogData, logLevel: LogLevel = 'info'): void {
    const { data, error, stats } = logData;

    const updatedLogData: LogData = {
      data: {
        environment: this._environment,
        loggerName: this._name,
        ...data,
      },
      error,
      stats,
    };

    this.emit('LOG', message, updatedLogData);

    if (this._log) {
      this._log(message, updatedLogData, logLevel);
    }
  }

  public now(): number {
    return this._performance.now();
  }
}
