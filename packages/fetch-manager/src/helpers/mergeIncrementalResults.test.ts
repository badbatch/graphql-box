import { incrementalFetchResults } from "../__testUtils__/incrementalFetchResults";
import mergeIncrementalResults from "./mergeIncrementalResults";

describe("mergeIncrementalResults", () => {
  it("should merge the results correctly", () => {
    expect(mergeIncrementalResults(incrementalFetchResults)).toMatchSnapshot();
  });
});
