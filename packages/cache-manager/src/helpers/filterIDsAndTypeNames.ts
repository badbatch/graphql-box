import { TYPE_NAME_KEY } from '@graphql-box/core';
import { deleteChildFields, getChildFields, getName } from '@graphql-box/helpers';
import { type FieldNode, type FragmentDefinitionNode, type OperationDefinitionNode } from 'graphql';
import { type CacheManagerContext } from '../types.ts';

export const filterIDsAndTypeNames = (
  field: FieldNode | FragmentDefinitionNode | OperationDefinitionNode,
  { fragmentDefinitions, typeIDKey }: CacheManagerContext,
) => {
  const fieldsAndTypeNames = getChildFields(field, { fragmentDefinitions });

  if (!fieldsAndTypeNames || fieldsAndTypeNames.length > 3) {
    return false;
  }

  const fieldNames = fieldsAndTypeNames.map(({ fieldNode }) => getName(fieldNode)!);

  if (fieldNames.length === 2 && fieldNames.every(name => name === typeIDKey || name === TYPE_NAME_KEY)) {
    deleteChildFields(
      field,
      fieldsAndTypeNames.map(({ fieldNode }) => fieldNode),
    );

    return true;
  }

  if ((fieldNames.length === 1 && fieldNames[0] === typeIDKey) || fieldNames[0] === TYPE_NAME_KEY) {
    const [fieldAndTypeName] = fieldsAndTypeNames;

    if (fieldAndTypeName) {
      const { fieldNode } = fieldAndTypeName;
      deleteChildFields(field, fieldNode);
      return true;
    }
  }

  return false;
};
