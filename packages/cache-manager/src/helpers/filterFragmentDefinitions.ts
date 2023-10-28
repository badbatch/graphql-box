import { deleteFragmentDefinitions } from '@graphql-box/helpers';
import { type DocumentNode } from 'graphql';
import { keys } from 'lodash-es';
import { type CacheManagerContext, type FieldPathChecklist } from '../types.ts';
import { type FragmentSpreadCheckist } from './createFragmentSpreadChecklist.ts';
import { filterField } from './filterField.ts';

export const filterFragmentDefinitions = (
  ast: DocumentNode,
  fieldPathChecklist: FieldPathChecklist,
  fragmentSpreadChecklist: FragmentSpreadCheckist,
  context: CacheManagerContext
) => {
  const definitionsToFilter = keys(fragmentSpreadChecklist).reduce<{ name: string; path: string }[]>(
    (namesAndPaths, key) => {
      const checklist = fragmentSpreadChecklist[key];

      if (!checklist) {
        return namesAndPaths;
      }

      const { deleted, paths, total } = checklist;
      return deleted === 0 && total === 1 ? [...namesAndPaths, { name: key, path: paths[0]! }] : namesAndPaths;
    },
    []
  );

  const { fragmentDefinitions = {} } = context;

  for (const { name, path } of definitionsToFilter) {
    const fragmentDefinition = fragmentDefinitions[name];

    if (!fragmentDefinition) {
      continue;
    }

    filterField(fragmentDefinition, fieldPathChecklist, fragmentSpreadChecklist, path, context);
  }

  const definitionsToDelete = keys(fragmentSpreadChecklist).reduce<string[]>((names, key) => {
    const checklist = fragmentSpreadChecklist[key];

    if (!checklist) {
      return names;
    }

    const { deleted, total } = checklist;
    return deleted > 0 && deleted === total ? [...names, key] : names;
  }, []);

  if (definitionsToDelete.length === 0) {
    return ast;
  }

  return deleteFragmentDefinitions(ast, {
    include: definitionsToDelete,
  });
};
