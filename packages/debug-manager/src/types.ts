import { type LogLevel, type PlainObject } from '@graphql-box/core';

export type Log = (message: string, data: PlainObject, level?: LogLevel) => void;

export interface UserOptions {
  /**
   * Where the debug manager is being used.
   */
  environment?: Environment;
  /**
   * The callback to pass log messages to your logger.
   */
  log?: Log;
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

export type Environment = 'client' | 'server' | 'worker' | 'workerClient';

export interface Performance {
  now(): number;
}
