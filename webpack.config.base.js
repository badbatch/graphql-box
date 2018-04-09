const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  module: {
    rules: [],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      DEBUG: !!process.env.DEBUG,
      NODE_ENV: 'production',
      TEST_ENV: !!process.env.TEST_ENV,
      WEB_ENV: true,
    }),
    new LodashModuleReplacementPlugin({
      cloning: true,
      paths: true,
    }),
  ],
};
