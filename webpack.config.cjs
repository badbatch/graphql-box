const swcConfig = require('@repodog/swc-config');
const webpackConfig = require('@repodog/webpack-config/test.cjs');

module.exports = {
  ...webpackConfig({ compiler: ['swc-loader', swcConfig.ts] }),
};
