import { type DirectiveParser } from '#types.ts';

export const includeDirectiveParser: DirectiveParser<{ if: boolean }> = (_node, _directive, variables) => {
  return variables.if ? undefined : null;
};
