const babelConfig = require('@repodog/babel-config/rollup');
const rollupConfig = require('@repodog/rollup-config');
const { babel: babelPlugin } = require('@rollup/plugin-babel');

module.exports = {
  ...rollupConfig({ compiler: babelPlugin(babelConfig) }),
};
