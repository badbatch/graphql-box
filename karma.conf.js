const { resolve } = require('path');
const webpack = require('webpack'); // eslint-disable-line
const webpackConfig = require('./webpack.config');

webpackConfig.plugins.splice(2, 1, new webpack.SourceMapDevToolPlugin({
  test: /\.tsx?$/,
}));

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
    webpack: webpackConfig,
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
