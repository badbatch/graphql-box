import { ParsedDirective } from "@graphql-box/helpers";

export default (directives: ParsedDirective[], name: string) => {
  return directives.reduce((matches: ParsedDirective[], directive) => {
    if (directive.name === name) {
      matches.push(directive);
    }

    return matches;
  }, []);
};
