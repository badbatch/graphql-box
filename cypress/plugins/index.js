const webpack = require('@cypress/webpack-preprocessor');
const { initPlugin } = require('cypress-plugin-snapshots/plugin');
const webpackOptions = require('../../webpack.config');

module.exports = (on, config) => {
  on('file:preprocessor', webpack({ webpackOptions }));
  initPlugin(on, config);
  return config;
};
