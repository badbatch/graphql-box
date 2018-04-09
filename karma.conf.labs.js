require('dotenv').config(); // eslint-disable-line
const customLaunchers = require('./custom-launchers.json');
const webpackConfig = require('./webpack.config.labs');

module.exports = (config) => {
  config.set({
    autoWatch: true,
    basePath: '',
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 500000,
    browsers: Object.keys(customLaunchers),
    captureTimeout: 200000,
    client: {
      captureConsole: true,
      mocha: { timeout: 0 },
    },
    colors: true,
    concurrency: 5,
    customLaunchers,
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'test/specs/index.ts',
      'src/worker.ts',
    ],
    hostname: 'ci.build',
    logLevel: config.LOG_INFO,
    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },
    port: 9876,
    preprocessors: {
      'test/specs/index.ts': ['webpack', 'sourcemap'],
      'src/worker.ts': ['webpack', 'sourcemap'],
    },
    proxies: {
      '/worker-handl.worker.js': '/base/src/worker.ts',
    },
    reporters: ['dots', 'mocha', 'saucelabs'],
    sauceLabs: {
      connectOptions: {
        logfile: '-',
        noSslBumpDomains: 'all',
        sharedTunnel: true,
        verbose: true,
      },
      startConnect: true,
      testName: 'Handl browser unit tests',
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
    },
    singleRun: true,
    webpack: webpackConfig,
  });
};
