import { MaybeRawFetchData } from "@graphql-box/core";
import responseDataSets from "../__testUtils__/responseDataSets";
import mergeResponseDataSets from "./mergeResponseDataSets";

describe("mergeResponseDataSets", () => {
  it("should merge the response data correctly", () => {
    expect(mergeResponseDataSets((responseDataSets as unknown) as MaybeRawFetchData[])).toMatchSnapshot();
  });
});
