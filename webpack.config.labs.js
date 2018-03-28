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
});

module.exports = {
  ...webpackConfig,
};
