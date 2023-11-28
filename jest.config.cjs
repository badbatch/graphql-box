const config = require('@repodog/jest-config');

const { moduleNameMapper } = config;
// Jest is picking up the wrong output of library
moduleNameMapper['^uuid$'] = '<rootDir>/node_modules/uuid/wrapper.mjs';

module.exports = {
  ...config,
  collectCoverage: false,
  collectCoverageFrom: [],
  moduleNameMapper,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
};
