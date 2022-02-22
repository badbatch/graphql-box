const repodogConfig = require('@repodog/jest-config');

module.exports = {
  ...repodogConfig,
  collectCoverageFrom: [
    'packages/**/*.{ts,tsx}',
    '!**/*.test.{ts,tsx}',
    '!**/bin/**',
    '!**/lib/**',
    '!**/node_modules/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  testMatch: ['<rootDir>/packages/**/*.test.{ts,tsx}'],
};
