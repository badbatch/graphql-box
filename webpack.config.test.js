const webpack = require('webpack');
const { resolve } = require('path');
const webpackConfig = require('./webpack.config.base');

webpackConfig.module.rules.unshift({
  include: [
    resolve(__dirname, 'src'),
    resolve(__dirname, 'test'),
  ],
  test: /\.tsx?$/,
  use: [{
    loader: 'awesome-typescript-loader',
    options: {
      babelCore: '@babel/core',
      transpileOnly: true,
      useBabel: true,
    },
  }],
}, {
  enforce: 'pre',
  exclude: [/node_modules/],
  test: /\.(tsx?|jsx?)$/,
  use: {
    loader: 'source-map-loader',
  },
}, {
  enforce: 'post',
  exclude: ['**/*.d.ts'],
  include: resolve(__dirname, 'src'),
  test: /\.tsx?$/,
  use: [{
    loader: 'istanbul-instrumenter-loader',
    options: { esModules: true },
  }],
});

webpackConfig.plugins.push(
  new webpack.LoaderOptionsPlugin({
    debug: true,
  }),
  new webpack.SourceMapDevToolPlugin({
    test: /\.(tsx?|jsx?)$/,
  }),
);

module.exports = {
  ...webpackConfig,
};
