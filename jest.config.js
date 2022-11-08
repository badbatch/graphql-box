const repodogConfig = require('@repodog/jest-config');

module.exports = {
  ...repodogConfig,
  collectCoverageFrom: [...repodogConfig.collectCoverageFrom, ...['!packages/test-utils/**']],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  testMatch: ['<rootDir>/packages/**/*.test.{ts,tsx}'],
};
