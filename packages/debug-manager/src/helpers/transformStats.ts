import { type LogData } from '@graphql-box/core';

export const transformStats = (stats?: LogData['stats']) => {
  if (!stats) {
    return {};
  }

  const { duration, endTime, startTime } = stats;

  return {
    duration,
    endTime,
    startTime,
  };
};
