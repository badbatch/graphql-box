const { COMPILER, DEBUG } = process.env;

if (!COMPILER) {
  process.env.COMPILER = 'swc';
}

const jestConfig = require('@repodog/jest-config');
const swcConfig = require('@repodog/swc-config');

const isDebug = DEBUG === 'true';

module.exports = {
  ...jestConfig({ compilerOptions: swcConfig }),
  collectCoverage: false,
  collectCoverageFrom: [],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
  ...(isDebug ? {} : { testMatch: ['**/src/**/*.test.{ts,tsx}'] }),
};
