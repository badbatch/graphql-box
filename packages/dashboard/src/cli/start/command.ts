import { type Argv } from 'yargs';

export const builder = (argv: Argv) =>
  argv
    .positional('log-tail-path', {
      demandOption: true,
      desc: 'The relative path from the cwd to the log file to use for tailing graphql-box application logs',
      type: 'string',
    })
    .option('https', {
      default: false,
      desc: 'Whether to use https instead of http for the graphql-box dashboard app',
      type: 'boolean',
    })
    .option('module-system', {
      choices: ['esm', 'cjs'],
      default: 'cjs',
      desc: 'Whether to run esm or cjs server code',
      type: 'string',
    })
    .option('skip-node-version-check', {
      default: false,
      desc: 'To skip the node version check',
      type: 'boolean',
    })
    .option('verbose', {
      default: false,
      desc: 'Whether to output verbose logs',
      type: 'boolean',
    });

export const command = 'start <log-tail-path>';
export const desc = 'Start the GraphqlBox dashboard';
export { handler } from './handler.ts';
