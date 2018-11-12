module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/**/*.ts',
    '!**/*.test.ts',
    '!**/bin/**',
    '!**/lib/**',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'json',
    'lcov',
    'text-summary',
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  testMatch: [
    '<rootDir>/packages/**/*.test.ts',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};
