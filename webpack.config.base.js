const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  module: {
    rules: [{
      test: /.worker\.js$/,
      use: {
        loader: 'worker-loader',
      },
    }],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      TEST_ENV: !!process.env.TEST_ENV,
      WEB_ENV: true,
    }),
    new LodashModuleReplacementPlugin({
      cloning: true,
      paths: true,
    }),
  ],
};
