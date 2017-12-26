const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    index: './src/index.ts',
  },
  output: {
    filename: '[name].js',
    library: 'Handl',
    libraryTarget: 'umd',
  },
  module: {
    rules: [{
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
      test: /.worker\.js$/,
      use: {
        loader: 'worker-loader',
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
    }],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      WEB_ENV: true,
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].js.map',
      test: /\.(tsx?|jsx?)$/,
    }),
    new LodashModuleReplacementPlugin(),
  ],
  devtool: 'source-map',
};
