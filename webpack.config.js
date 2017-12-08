const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    handl: './src/index.ts',
    'handl.min': './src/index.ts',
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'Handl',
    path: resolve(__dirname, 'lib', 'browser'),
    umdNamedDefine: true,
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: [{
        loader: 'babel-loader',
        options: {
          babelrc: false,
          plugins: ['lodash'],
          presets: [
            ['@babel/preset-env', {
              targets: { browsers: 'last 4 versions' },
              useBuiltIns: 'usage',
            }],
            '@babel/preset-stage-0',
          ],
        },
      }, {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          compilerOptions: {
            declaration: false,
            target: 'es5',
          },
        },
      }],
    }],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      sourceMap: true,
    }),
    new LodashModuleReplacementPlugin(),
  ],
  devtool: 'source-map',
};
