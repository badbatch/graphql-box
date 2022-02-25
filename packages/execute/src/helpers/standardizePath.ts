import { AsyncExecutionResult, ExecutionPatchResult } from "graphql";
import { SetRequired } from "type-fest";

export default (result: AsyncExecutionResult) => {
  if (!("path" in result)) {
    return result;
  }

  const { path, ...rest } = result as SetRequired<ExecutionPatchResult, "path">;

  return {
    ...rest,
    paths: [path.join(".")],
  };
};
