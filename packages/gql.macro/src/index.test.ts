import { transform } from "@babel/core";
import writeFile from "./helpers/writeFile";

jest.mock("./helpers/writeFile");

const transformSourceFile = (sourceFile: string, macroConfig: Record<string, any> = {}) => {
  const transformed = transform(sourceFile, {
    filename: "test.js",
    plugins: [
      [
        "macros",
        {
          gql: {
            ...macroConfig,
            basePath: __dirname,
          },
        },
      ],
    ],
  })?.code;

  return transformed;
};

describe("gql.macro", () => {
  describe("when the macro is a tag call", () => {
    it("should transform the macro reference correctly", () => {
      const sourceFile = `
        import gql from "./packages/gql.macro/src/macro";

        const GET_CONFIG = gql\`./__testUtils__/gql/queries/GetConfig.gql\`;
        export default GET_CONFIG;
      `;

      expect(transformSourceFile(sourceFile)).toMatchSnapshot();
      expect(writeFile).toHaveBeenCalledTimes(1);
    });
  });
});
