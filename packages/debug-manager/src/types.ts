import { type GraphqlEnv, type GraphqlStep, type LogData, type LogLevel } from '@graphql-box/core';

export type Log = (message: GraphqlStep, data: LogData, level?: LogLevel) => void;

export interface UserOptions {
  /**
   * Where the debug manager is being used.
   */
  environment?: GraphqlEnv;
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

export interface Performance {
  now(): number;
}
