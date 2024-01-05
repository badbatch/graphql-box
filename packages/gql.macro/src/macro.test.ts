import { transformSync } from '@babel/core';
import { expect, jest } from '@jest/globals';
import { writeFile } from './helpers/writeFile.ts';

jest.mock('./helpers/writeFile.ts', () => ({
  writeFile: jest.fn(),
}));

const transformSourceFile = (sourceFile: string, macroConfig: Record<string, unknown> = {}) => {
  const transformed = transformSync(sourceFile, {
    filename: 'test.js',
    plugins: [
      [
        'macros',
        {
          gql: {
            ...macroConfig,
            // eslint-disable-next-line unicorn/prefer-module
            basePath: __dirname,
          },
        },
      ],
    ],
  })?.code;

  return transformed;
};

describe('gql.macro', () => {
  describe('when the macro is a tag call', () => {
    let transformed: string | null | undefined;

    beforeAll(() => {
      const sourceFile = `
      import importGql from "./packages/gql.macro/src/macro";

      const GET_CONFIG = importGql\`./__testUtils__/gql/queries/GetConfig.gql\`;
      export default GET_CONFIG;
    `;

      transformed = transformSourceFile(sourceFile);
    });

    it('should transform the macro reference correctly', () => {
      expect(transformed).toMatchSnapshot();
    });

    it('should call writeFile the correct number of times', () => {
      expect(writeFile).toHaveBeenCalledTimes(1);
    });

    it('should call writeFile with the correct arguments', () => {
      expect(writeFile).toHaveBeenCalledWith(`${process.cwd()}/requestWhitelist.txt`, [
        '33771f995332f7d2c4f83258a37d3108',
      ]);
    });
  });
});
