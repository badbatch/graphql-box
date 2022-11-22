import { ExecutionResult } from "graphql";
import { SetRequired } from "type-fest";

export default (result: ExecutionResult) => {
  if (!("path" in result)) {
    return result;
  }

  const { path, ...rest } = result as SetRequired<ExecutionPatchResult, "path">;

  return {
    ...rest,
    paths: [path.join(".")],
  };
};
