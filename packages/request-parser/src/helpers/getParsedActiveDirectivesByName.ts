import { type ParsedDirective } from '@graphql-box/helpers';
import { getParsedDirectivesByName } from './getParsedDirectivesByName.ts';

export const getParsedActiveDirectivesByName = (directives: ParsedDirective[], name: string) => {
  const directivesByName = getParsedDirectivesByName(directives, name);
  return directivesByName.filter(({ args }) => args.if !== false);
};
