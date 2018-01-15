const { resolve } = require('path');
const tsConfig = require('./tsconfig.test.json');
const webpackConfig = require('./webpack.config.test');

function createGraphqlServer() {
  require('ts-node').register(tsConfig);

  require('source-map-support').install({
    environment: 'node',
    hookRequire: true,
  });

  const { mockRestRequest } = require('./test/helpers/index.ts');
  const graphqlServer = require('./test/server/index.ts').default;
  const server = graphqlServer();
  mockRestRequest('product', '402-5806');

  this.onRunComplete = () => {
    server.close();
  };
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
