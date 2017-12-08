const { resolve } = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'test/**/*',
    ],
    preprocessors: {
      'test/**/*': ['webpack', 'sourcemap'],
    },
    webpack: { ...webpackConfig, devtool: 'cheap-module-eval-source-map' },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    concurrency: Infinity,
    client: { captureConsole: true },
    mime: {
      'text/x-typescript': ['ts','tsx'],
    },
  });
};
