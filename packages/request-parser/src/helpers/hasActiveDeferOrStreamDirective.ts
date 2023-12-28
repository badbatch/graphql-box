import { DEFER, STREAM } from '@graphql-box/core';
import { type ParsedDirective } from '@graphql-box/helpers';
import { getParsedActiveDirectivesByName } from './getParsedActiveDirectivesByName.ts';

export const hasActiveDeferOrStreamDirective = (directives: ParsedDirective[] = []) => {
  return (
    getParsedActiveDirectivesByName(directives, DEFER).length > 0 ||
    getParsedActiveDirectivesByName(directives, STREAM).length > 0
  );
};
