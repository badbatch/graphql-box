const rollupConfig = require('../../rollup.config.cjs');

const { MODULE_SYSTEM = 'esm' } = process.env;
const outputExtension = MODULE_SYSTEM === 'esm' ? 'mjs' : 'cjs';

module.exports = [
  {
    ...rollupConfig,
    input: './src/server/index.ts',
    output: {
      ...rollupConfig.output,
      file: `./dist/server.${outputExtension}`,
    },
  },
  {
    ...rollupConfig,
    input: './src/cli/index.ts',
    output: {
      ...rollupConfig.output,
      file: `./dist/cli.${outputExtension}`,
    },
  },
];
