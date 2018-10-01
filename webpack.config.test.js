const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: {
        loader: 'babel-loader',
      },
    }, {
      enforce: 'pre',
      test: /\.(tsx?|jsx?)$/,
      use: {
        loader: 'source-map-loader',
      },
    }],
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
    new webpack.SourceMapDevToolPlugin({
      test: /\.(tsx?|jsx?)$/,
    }),
    new LodashModuleReplacementPlugin(),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
};
