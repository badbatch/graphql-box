const config = require('@repodog/jest-config');

const { DEBUG } = process.env;
const isDebug = DEBUG === 'true';

module.exports = {
  ...config,
  collectCoverage: false,
  collectCoverageFrom: [],
  ...(isDebug ? {} : { testMatch: ['<rootDir>/packages/**/*.test.ts', '<rootDir>/tests/node/index.test.ts'] }),
};
