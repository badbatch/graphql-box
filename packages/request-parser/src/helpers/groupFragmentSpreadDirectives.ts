import { type ParsedDirective } from '@graphql-box/helpers';

export const groupFragmentSpreadDirectives = (parsedFragmentSpreadDirectives: ParsedDirective[]) =>
  parsedFragmentSpreadDirectives.reduce((acc: Record<string, ParsedDirective[]>, { parentName, ...rest }) => {
    const value = acc[parentName] ?? [];
    value.push({ parentName, ...rest });
    acc[parentName] = value;
    return acc;
  }, {});
