import { ExecutionResult, ExperimentalIncrementalExecutionResults } from "graphql";

export const areIncrementalExecutionResults = (
  executeResults: ExecutionResult | ExperimentalIncrementalExecutionResults,
): executeResults is ExperimentalIncrementalExecutionResults =>
  "initialResult" in executeResults && "subsequentResults" in executeResults;
