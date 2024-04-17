const rollupConfig = require('../../rollup.config.cjs');

module.exports = {
  ...rollupConfig,
  input: './src/server/index.ts',
  output: {
    ...rollupConfig.output,
    file: './server.mjs',
  },
};
