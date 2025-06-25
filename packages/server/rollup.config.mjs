import config from '../../rollup.config.mjs';

const { input, output, ...otherConfig } = config;

// rollup requires default export
// eslint-disable-next-line import-x/no-default-export
export default [
  config,
  {
    ...otherConfig,
    input: input.replace('index', 'express'),
    output: {
      ...output,
      file: output.file.replace('index', 'express'),
    },
  },
  {
    ...otherConfig,
    input: input.replace('index', 'next'),
    output: {
      ...output,
      file: output.file.replace('index', 'next'),
    },
  },
  {
    ...otherConfig,
    input: input.replace('index', 'ws'),
    output: {
      ...output,
      file: output.file.replace('index', 'ws'),
    },
  },
];
