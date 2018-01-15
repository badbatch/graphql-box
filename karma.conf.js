const { resolve } = require('path');
const createGraphqlServer = require('./karma/plugins/graphql-server');
const webpackConfig = require('./webpack.config.test');

module.exports = (config) => {
  config.set({
    autoWatch: true,
    basePath: '',
    client: {
      captureConsole: true,
      mocha: { timeout: 0 },
    },
    colors: true,
    concurrency: Infinity,
    coverageIstanbulReporter: {
      dir: resolve(__dirname, 'coverage', 'web'),
      fixWebpackSourcePaths: true,
      reports: ['json', 'lcov', 'text-summary'],
    },
    files: [
      'test/specs/index.ts',
    ],
    frameworks: ['mocha', 'chai', 'sinon', 'graphql-server'],
    logLevel: config.LOG_INFO,
    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },
    plugins: [
      'karma-chai',
      'karma-chrome-launcher',
      'karma-coverage-istanbul-reporter',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-sinon',
      'karma-sourcemap-loader',
      'karma-webpack',
      { 'framework:graphql-server': ['factory', createGraphqlServer] },
    ],
    port: 9876,
    preprocessors: {
      'test/specs/index.ts': ['webpack', 'sourcemap'],
    },
    webpack: webpackConfig,
  });
};
