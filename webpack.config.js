const webpack = require('webpack');

module.exports = {
  devtool: false,
  mode: 'development',
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: {
        loader: 'babel-loader',
        options: {
          configFile: './babel.config.js',
        },
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
      moduleFilenameTemplate: 'webpack://[namespace]/[resource-path]?[loaders]',
      test: /\.(tsx?|jsx?)$/,
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json'],
    mainFields: ['browser', 'module', 'main'],
    symlinks: false,
  },
};
