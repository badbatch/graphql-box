import {
  type DebugManagerDef,
  type GraphqlEnv,
  type GraphqlStep,
  type LogData,
  type LogLevel,
} from '@graphql-box/core';
import { ArgsError } from '@graphql-box/helpers';
import { EventEmitter } from 'eventemitter3';
import { isFunction, isString } from 'lodash-es';
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

    if (options.log && !isFunction(options.log)) {
      errors.push(new ArgsError('@graphql-box/debug-manager expected options.log to be a function.'));
    }

    // Okay for purpose of checking property type
    // eslint-disable-next-line @typescript-eslint/unbound-method
    if (!isFunction(options.performance.now)) {
      errors.push(new ArgsError('@graphql-box/debug-manager expected options.performance.now to be a function.'));
    }

    if (errors.length > 0) {
      throw new AggregateError(errors, '@graphql-box/debug-manager argument validation errors');
    }

    this._log = options.log ?? null;
    this._name = options.name;
    this._performance = options.performance;
    this._environment = options.environment ?? 'client';
  }

  public log(message: GraphqlStep, logData: LogData, logLevel: LogLevel = 'info', passthrough = false): void {
    const { data, error, stats } = logData;

    const finalData = passthrough
      ? logData
      : {
          data: {
            environment: this._environment,
            loggerName: this._name,
            ...data,
          },
          error,
          stats,
        };

    try {
      this.emit('LOG', message, finalData);

      if (this._log) {
        this._log(message, finalData, logLevel);
      }
    } catch (error_) {
      console.error(error_);
    }
  }

  public now(): number {
    return this._performance.now();
  }
}
