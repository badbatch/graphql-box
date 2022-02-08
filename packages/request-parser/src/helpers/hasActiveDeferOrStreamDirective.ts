import { DEFER, STREAM } from "@graphql-box/core";
import { ParsedDirective } from "@graphql-box/helpers";
import getParsedActiveDirectivesByName from "./getParsedActiveDirectivesByName";

export default (directives: ParsedDirective[] = []) => {
  return (
    !!getParsedActiveDirectivesByName(directives, DEFER).length ||
    !!getParsedActiveDirectivesByName(directives, STREAM).length
  );
};
