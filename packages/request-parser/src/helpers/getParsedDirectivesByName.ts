import { type ParsedDirective } from '@graphql-box/helpers';

export const getParsedDirectivesByName = (directives: ParsedDirective[], name: string) => {
  return directives.reduce((matches: ParsedDirective[], directive) => {
    if (directive.name === name) {
      matches.push(directive);
    }

    return matches;
  }, []);
};
