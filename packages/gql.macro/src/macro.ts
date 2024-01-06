import { createMacro } from 'babel-plugin-macros';
import { macroHandler } from './handler.ts';

export const macro = createMacro(macroHandler, {
  configName: 'gql',
}) as (path: string) => string;

// eslint-disable-next-line import/no-default-export
export default macro;
