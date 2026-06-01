import { type LogDump } from '@graphql-box/core';
import { castArray } from 'lodash-es';

export const logErrorsToConsoleInDevelop = (maybeErrors?: Error | Error[] | readonly Error[], maybeLogs?: LogDump) => {
  if (process.env.NODE_ENV === 'development' && maybeErrors) {
    const errors = castArray(maybeErrors);

    for (const entry of errors) {
      const error = Array.isArray(entry) ? entry.at(0) : entry;

      if (error) {
        console.error(error.message, { error, logs: maybeLogs });
      }
    }
  }
};
