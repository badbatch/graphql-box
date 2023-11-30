import { type ParsedDirective } from '@graphql-box/helpers';

export const groupFragmentSpreadDirectives = (parsedFragmentSpreadDirectives: ParsedDirective[]) =>
  parsedFragmentSpreadDirectives.reduce((acc: Record<string, ParsedDirective[]>, { parentName, ...rest }) => {
    let value = acc[parentName];

    if (!value) {
      value = [];
    }

    value.push({ parentName, ...rest });
    acc[parentName] = value;
    return acc;
  }, {});
