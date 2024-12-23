import { deleteInlineFragments, getChildFields, getInlineFragments, getName } from '@graphql-box/helpers';
import { type FieldNode, type FragmentDefinitionNode, type OperationDefinitionNode } from 'graphql';
import { type CacheManagerContext } from '../types.ts';

export const filterInlineFragments = (
  field: FieldNode | FragmentDefinitionNode | OperationDefinitionNode,
  { fragmentDefinitions, typeIDKey }: CacheManagerContext,
) => {
  const inlineFragments = getInlineFragments(field);
  let filtered = false;

  for (const fragment of inlineFragments) {
    const fieldsAndTypeNames = getChildFields(fragment, { fragmentDefinitions });

    if (!fieldsAndTypeNames || fieldsAndTypeNames.length === 0) {
      deleteInlineFragments(field, fragment);
      filtered = true;
      continue;
    }

    const [fieldAndTypeName] = fieldsAndTypeNames;

    if (fieldAndTypeName) {
      const { fieldNode } = fieldAndTypeName;

      if (getName(fieldNode) === typeIDKey) {
        deleteInlineFragments(field, fragment);
        filtered = true;
      }
    }
  }

  return filtered;
};
