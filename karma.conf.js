const { join } = require('path');
const webpack = require('./webpack.config');

const SNAPSHOTS_GLOB = '**/__snapshots__/**/*.md';
const TESTS_GLOB = 'integration/tests/**/*.test.ts';
const WORKER_PATH = 'integration/tests/worker-client/worker';

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
      SNAPSHOTS_GLOB,
      TESTS_GLOB,
      `${WORKER_PATH}.ts`,
    ],
    frameworks: ['mocha', 'chai', 'sinon', 'snapshot', 'mocha-snapshot'],
    logLevel: config.LOG_INFO,
    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },
    port: 9876,
    preprocessors: {
      [SNAPSHOTS_GLOB]: ['snapshot'],
      [TESTS_GLOB]: ['webpack', 'sourcemap'],
      [`${WORKER_PATH}.ts`]: ['webpack', 'sourcemap'],
    },
    proxies: {
      '/worker.js': `/base/${WORKER_PATH}.js`,
    },
    snapshot: {
      pathResolver: (basePath, suiteName) => join(basePath, 'integration/tests/__snapshots__', `${suiteName}.md`),
      prune: !!process.env.PRUNE,
      update: !!process.env.UPDATE,
    },
    webpack,
  });
};
