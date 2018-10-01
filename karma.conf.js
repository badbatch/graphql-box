const { resolve } = require('path');
const createGraphqlServer = require('./karma/plugins/graphql-server');
const webpack = require('./webpack.config.test');

const WORKER_PATH = 'packages/core-worker/src/worker/index.ts';
const files = [`tests/integration/${process.env.TEST_ENV}/**/*.test.*`];
const preprocessors = { [`tests/integration/${process.env.TEST_ENV}/**/*.test.*`]: ['webpack', 'sourcemap'] };
const proxies = {};

if (process.env.TEST_ENV === 'worker') {
  files.push(WORKER_PATH);
  preprocessors[WORKER_PATH] = ['webpack', 'sourcemap'];
  proxies['/handl.worker.js'] = `/base/${WORKER_PATH}`;
}

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
      dir: resolve(__dirname, 'coverage', process.env.TEST_ENV),
      fixWebpackSourcePaths: true,
      reports: ['json', 'lcov', 'text-summary'],
    },
    files,
    frameworks: ['mocha', 'chai', 'sinon', 'graphql-server'],
    logLevel: config.LOG_INFO,
    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },
    plugins: [
      'karma-chai',
      'karma-chrome-launcher',
      'karma-coverage-istanbul-reporter',
      'karma-edge-launcher',
      'karma-firefox-launcher',
      'karma-ie-launcher',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-safari-launcher',
      'karma-sinon',
      'karma-sourcemap-loader',
      'karma-webpack',
      { 'framework:graphql-server': ['factory', createGraphqlServer] },
    ],
    port: 9876,
    preprocessors,
    proxies,
    webpack,
  });
};
