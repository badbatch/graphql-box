import { basename, resolve } from 'path';
import { outputFileSync } from 'fs-extra';
import { plugin as analyzer } from 'rollup-plugin-analyzer';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import nodeResolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import rootPackageJson from './package.json';

const dirRoot = resolve(process.cwd());

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
    file: `${dirRoot}/lib/browser/index.js`,
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
    file: `${dirRoot}/lib/browser/index.js`,
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

if (process.env.NODE_ENV === 'development') {
  config.push(devConfig);
} else {
  config.push(prodConfig);
}

export default config;
