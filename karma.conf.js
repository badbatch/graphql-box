const { join } = require('path');
const webpack = require('./webpack.config');

module.exports = (config) => {
  config.set({
    autoWatch: true,
    basePath: '',
    client: {
      captureConsole: false,
      mocha: { timeout: 0 },
    },
    colors: true,
    concurrency: Infinity,
    files: [
      '**/__snapshots__/**/*.md',
      'integration/tests/**/*.test.js',
    ],
    frameworks: ['mocha', 'chai', 'sinon', 'snapshot', 'mocha-snapshot'],
    logLevel: config.LOG_INFO,
    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },
    port: 9876,
    preprocessors: {
      '**/__snapshots__/**/*.md': ['snapshot'],
      'integration/tests/**/*.test.js': ['webpack', 'sourcemap'],
    },
    proxies: {},
    snapshot: {
      pathResolver: (basePath, suiteName) => join(basePath, 'integration/tests/__snapshots__', `${suiteName}.md`),
      prune: !!process.env.PRUNE,
      update: !!process.env.UPDATE,
    },
    webpack,
  });
};
