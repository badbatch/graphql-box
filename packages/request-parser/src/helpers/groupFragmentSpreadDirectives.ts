import { ParsedDirective } from "@graphql-box/helpers";

export default (parsedFragmentSpreadDirectives: ParsedDirective[]) =>
  parsedFragmentSpreadDirectives.reduce((acc: { [key: string]: ParsedDirective[] }, { parentName, ...rest }) => {
    if (!acc[parentName]) {
      acc[parentName] = [];
    }

    acc[parentName].push({ parentName, ...rest });
    return acc;
  }, {});
