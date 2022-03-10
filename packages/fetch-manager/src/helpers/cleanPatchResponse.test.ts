import { MaybeRawFetchData } from "@graphql-box/core";
import responseDataSets from "../__testUtils__/responseDataSets";
import cleanPatchResponse from "./cleanPatchResponse";

describe("cleanPatchResponse", () => {
  it("should merge the response data correctly", () => {
    expect(cleanPatchResponse((responseDataSets[5] as unknown) as MaybeRawFetchData)).toMatchSnapshot();
  });
});
