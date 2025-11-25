const { COMPILER, DEBUG } = process.env;

if (!COMPILER) {
  process.env.COMPILER = 'swc';
}

const jestConfig = require('@repodog/jest-config');
const swcConfig = require('@repodog/swc-config');

const isDebug = DEBUG === 'true';
const config = jestConfig({ compilerOptions: swcConfig });

module.exports = {
  ...config,
  collectCoverageFrom: [
    'packages/**/*.ts',
    '!packages/core/**/*.ts',
    '!packages/test-utils/**/*.ts',
    ...config.collectCoverageFrom.slice(1),
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
  ...(isDebug ? {} : { testMatch: ['**/src/**/*.test.{ts,tsx}'] }),
};
