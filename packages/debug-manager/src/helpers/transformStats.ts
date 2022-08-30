import { LogData } from "@graphql-box/core";

export default (stats?: LogData["stats"]) => {
  if (!stats) {
    return {};
  }

  const { duratioin, endTime, startTime } = stats;

  return {
    duratioin,
    endTime,
    startTime,
  };
};
