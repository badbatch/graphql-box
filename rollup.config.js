import { basename, resolve } from 'path';
import { outputFileSync } from 'fs-extra';
import { plugin as analyzer } from 'rollup-plugin-analyzer';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import nodeResolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const rootPackageJson = require('./package.json');

const dirRoot = resolve(process.cwd());
const isDev = process.env.NODE_ENV === 'development';

const devAndProdModuleExport = `
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./production.min.js');
} else {
  module.exports = require('./development.js');
}
`;

const devModuleExport = `
module.exports = require('./development.js');
`;

outputFileSync(`${dirRoot}/lib/browser/index.js`, `
'use strict';
${isDev ? devModuleExport : devAndProdModuleExport}
`);

function getKeys(dependencies = []) {
  return Object.keys(dependencies);
}

const packageJson = require(`${dirRoot}/package.json`); // eslint-disable-line import/no-dynamic-require

const devDependencies = getKeys(rootPackageJson.devDependencies);
const peerDependencies = getKeys(packageJson.peerDependencies);
const dependencies = getKeys(packageJson.dependencies);
const externalModuleNames = [...dependencies, ...peerDependencies, ...devDependencies];

function external(id) {
  return externalModuleNames.some(name => id.startsWith(name));
}

const extensions = ['.mjs', '.js', '.jsx', 'json', '.ts', '.tsx'];

const defaultPlugins = [
  nodeResolve({
    extensions,
  }),
  commonjs(),
  json(),
  babel({
    configFile: '../../babel.config.js',
    extensions,
    runtimeHelpers: true,
  }),
];

function writeTo(analysisString) {
  outputFileSync(`${dirRoot}/lib/browser/production.analysis.txt`, analysisString);
}

const dirName = basename(dirRoot);

function sourcemapPathTransform(sourcePath) {
  if (/node_modules/.test(sourcePath)) return sourcePath;
  return sourcePath.replace('../../src/', `../${dirName}/src/`);
}

const devConfig = {
  external,
  input: `${dirRoot}/src/index.ts`,
  output: {
    file: `${dirRoot}/lib/browser/development.js`,
    format: 'esm',
    sourcemap: true,
    sourcemapPathTransform,
  },
  plugins: [
    ...defaultPlugins,
  ],
};

const prodConfig = {
  external,
  input: `${dirRoot}/src/index.ts`,
  output: {
    file: `${dirRoot}/lib/browser/production.min.js`,
    format: 'esm',
    sourcemap: true,
    sourcemapPathTransform,
  },
  plugins: [
    ...defaultPlugins,
    terser(),
    analyzer({ writeTo }),
  ],
};

const config = [];

if (isDev) {
  config.push(devConfig);
} else {
  config.push(devConfig, prodConfig);
}

export default config;
