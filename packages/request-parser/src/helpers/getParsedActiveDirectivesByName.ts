import { ParsedDirective } from "@graphql-box/helpers";
import getParsedDirectivesByName from "./getParsedDirectivesByName";

export default (directives: ParsedDirective[], name: string) => {
  const directivesByName = getParsedDirectivesByName(directives, name);
  return directivesByName.filter(({ args }) => args.if !== false);
};
