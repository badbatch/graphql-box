const { COMPILER, DEBUG } = process.env;

if (!COMPILER) {
  process.env.COMPILER = 'swc';
}

const jestConfig = require('@repodog/jest-config');
const swcConfig = require('@repodog/swc-config');

const isDebug = DEBUG === 'true';
const { moduleNameMapper, ...otherConfig } = jestConfig({ compilerOptions: swcConfig });
// Jest is picking up the wrong output of library
moduleNameMapper['^uuid$'] = '<rootDir>/node_modules/uuid/wrapper.mjs';

module.exports = {
  ...otherConfig,
  collectCoverage: false,
  collectCoverageFrom: [],
  moduleNameMapper,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
  ...(isDebug ? {} : { testMatch: ['**/src/**/*.test.{ts,tsx}'] }),
};
