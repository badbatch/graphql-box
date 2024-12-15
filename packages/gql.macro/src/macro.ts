import { createMacro } from 'babel-plugin-macros';
import { macroHandler } from './handler.ts';

// Required for consumer macro import typing, makes
// things much more simple for consumer.
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const macro = createMacro(macroHandler, {
  configName: 'gql',
}) as (path: TemplateStringsArray) => string;

// eslint-disable-next-line import-x/no-default-export
export default macro;
