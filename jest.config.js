const repodogConfig = require('@repodog/jest-config');

module.exports = {
  ...repodogConfig,
  collectCoverageFrom: [
    '!packages/test-utils/**',
    'node_modules/@graphql-box/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  testMatch: ['<rootDir>/packages/**/*.test.{ts,tsx}'],
};
