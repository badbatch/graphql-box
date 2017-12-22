const { resolve } = require('path');
const webpackConfig = require('./webpack.config');

module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'test/specs/index.ts',
    ],
    preprocessors: {
      'test/specs/index.ts': ['webpack', 'sourcemap'],
    },
    webpack: { ...webpackConfig, devtool: 'cheap-module-eval-source-map' },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    concurrency: Infinity,
    client: {
      captureConsole: true,
      mocha: { timeout: 0 },
    },
    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },
    coverageIstanbulReporter: {
      dir: resolve(__dirname, 'coverage', 'web'),
      fixWebpackSourcePaths: true,
      reports: ['json', 'lcov', 'text-summary'],
    },
  });
};
