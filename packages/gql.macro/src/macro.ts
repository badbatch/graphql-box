import { createMacro } from 'babel-plugin-macros';
import { macroHandler } from './handler.ts';

// eslint-disable-next-line import/no-default-export
export default createMacro(macroHandler, {
  configName: 'gql',
}) as (path: string) => string;
