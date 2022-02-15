import { deleteFragmentDefinitions, getFragmentDefinitions } from "@graphql-box/helpers";
import { DocumentNode } from "graphql";
import { keys } from "lodash";
import { CacheManagerContext, FieldPathChecklist } from "../defs";
import { FragmentSpreadCheckist } from "./createFragmentSpreadChecklist";
import filterField from "./filterField";

export default (
  ast: DocumentNode,
  fieldPathChecklist: FieldPathChecklist,
  fragmentSpreadChecklist: FragmentSpreadCheckist,
  context: CacheManagerContext,
) => {
  const definitionsToFilter = keys(fragmentSpreadChecklist).reduce(
    (namesAndPaths: { name: string; path: string }[], key) => {
      const { deleted, total } = fragmentSpreadChecklist[key];

      return deleted === 0 && total === 1
        ? [...namesAndPaths, { name: key, path: fragmentSpreadChecklist[key].paths[0] as string }]
        : namesAndPaths;
    },
    [],
  );

  const fragmentDefinitions = getFragmentDefinitions(ast) ?? {};

  definitionsToFilter.forEach(({ name, path }) => {
    const fragmentDefinition = fragmentDefinitions[name];
    filterField(fragmentDefinition, fieldPathChecklist, fragmentSpreadChecklist, path, context);
  });

  const definitionsToDelete = keys(fragmentSpreadChecklist).reduce((names: string[], key) => {
    const { deleted, total } = fragmentSpreadChecklist[key];
    return deleted > 0 && deleted === total ? [...names, key] : names;
  }, []);

  return deleteFragmentDefinitions(ast, {
    include: definitionsToDelete,
  });
};
