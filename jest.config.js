module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/**/*.{ts,tsx}',
    '!**/bin/**',
    '!**/lib/**',
    '!**/node_modules/**',
    '!**/test/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'json',
    'lcov',
    'text-summary',
  ],
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.test.json',
      useBabelrc: true,
    },
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  testMatch: [
    '**/src/**/*.test.*',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
