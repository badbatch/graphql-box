import config from '../../rollup.config.mjs';

const { input, output, ...otherConfig } = config;

// rollup requires default export
// eslint-disable-next-line import-x/no-default-export
export default [
  config,
  {
    ...otherConfig,
    input: input.replace('index', 'server'),
    output: {
      ...output,
      file: output.file.replace('index', 'server'),
    },
  },
];
