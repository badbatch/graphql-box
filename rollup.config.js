import { resolve } from 'path';
import { outputFileSync } from 'fs-extra';
import { plugin as analyzer } from 'rollup-plugin-analyzer';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import nodeResolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const rootPackageJson = require('./package.json');

const dirRoot = resolve(process.cwd());

outputFileSync(`${dirRoot}/lib/browser/index.js`, `
'use strict';
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./production.min.js');
} else {
  module.exports = require('./development.js');
}
`);

function getKeys(dependencies = []) {
  return Object.keys(dependencies);
}

const packageJson = require(`${dirRoot}/package.json`); // eslint-disable-line import/no-dynamic-require

const devDependencies = getKeys(rootPackageJson.devDependencies);
const peerDependencies = getKeys(packageJson.peerDependencies);
const dependencies = getKeys(packageJson.dependencies).filter(name => /@handl/.test(name));
const externalModuleNames = [...dependencies, ...peerDependencies, ...devDependencies];

function external(id) {
  return externalModuleNames.some(name => id.startsWith(name));
}

const extensions = ['.mjs', '.js', '.jsx', 'json', '.ts', '.tsx'];

const defaultPlugins = [
  nodeResolve({
    browser: true,
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

export default [{
  external,
  input: `${dirRoot}/src/index.ts`,
  output: {
    file: `${dirRoot}/lib/browser/development.js`,
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    ...defaultPlugins,
  ],
}, {
  external,
  input: `${dirRoot}/src/index.ts`,
  output: {
    file: `${dirRoot}/lib/browser/production.min.js`,
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    ...defaultPlugins,
    terser(),
    analyzer({ writeTo }),
  ],
}];
