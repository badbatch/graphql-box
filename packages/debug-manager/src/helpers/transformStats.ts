import { LogData } from "@graphql-box/core";

export default (stats?: LogData["stats"]) => {
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
