const config = require('../../rollup.config.cjs');

const { input, output, ...otherConfig } = config;

module.exports = [
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
