import { TYPE_NAME_KEY } from '@graphql-box/core';
import {
  buildFieldKeysAndPaths,
  deleteChildFields,
  getChildFields,
  getName,
  hasChildFields,
} from '@graphql-box/helpers';
import { type FieldNode, type FragmentDefinitionNode, Kind, type OperationDefinitionNode } from 'graphql';
import { type CacheManagerContext, type FieldPathChecklist, type FragmentSpreadFieldCounter } from '../types.ts';
import { checkFieldPathChecklist } from './checkFieldPathChecklist.ts';
import { type FragmentSpreadCheckist } from './createFragmentSpreadChecklist.ts';
import { filterFragmentSpreads } from './filterFragmentSpreads.ts';
import { filterIDsAndTypeNames } from './filterIDsAndTypeNames.ts';
import { filterInlineFragments } from './filterInlineFragments.ts';

export const filterField = (
  field: FieldNode | FragmentDefinitionNode | OperationDefinitionNode,
  fieldPathChecklist: FieldPathChecklist,
  fragmentSpreadChecklist: FragmentSpreadCheckist,
  ancestorRequestFieldPath: string,
  context: CacheManagerContext
): boolean => {
  const { fragmentDefinitions, typeIDKey } = context;
  const fieldsAndTypeNames = getChildFields(field, { fragmentDefinitions });

  if (!fieldsAndTypeNames) {
    return false;
  }

  const fragmentSpreadFieldCounter: FragmentSpreadFieldCounter = {};

  for (let index = fieldsAndTypeNames.length - 1; index >= 0; index -= 1) {
    const fieldAndTypeName = fieldsAndTypeNames[index];

    if (!fieldAndTypeName) {
      continue;
    }

    const { fieldNode: childField, fragmentKind, fragmentName, typeName: childTypeName } = fieldAndTypeName;

    if (fragmentKind === Kind.FRAGMENT_SPREAD && fragmentName && !fragmentSpreadFieldCounter[fragmentName]) {
      fragmentSpreadFieldCounter[fragmentName] = {
        hasData: 0,
        total: fragmentDefinitions?.[fragmentName]
          ? getChildFields(fragmentDefinitions[fragmentName]!, { fragmentDefinitions })?.length ?? 0
          : 0,
      };
    }

    const childFieldName = getName(childField);

    if (childFieldName === typeIDKey || childFieldName === TYPE_NAME_KEY) {
      continue;
    }

    const { requestFieldPath } = buildFieldKeysAndPaths(
      childField,
      {
        requestFieldPath: ancestorRequestFieldPath,
      },
      context
    );

    const { hasData, typeUnused } = checkFieldPathChecklist(fieldPathChecklist.get(requestFieldPath), childTypeName);

    if (hasData || typeUnused) {
      if (fragmentKind === Kind.FRAGMENT_SPREAD && fragmentName) {
        const counter = fragmentSpreadFieldCounter[fragmentName];

        if (counter) {
          counter.hasData += 1;
        }
      } else if (!hasChildFields(childField, { fragmentDefinitions })) {
        deleteChildFields(field, childField);
      } else if (filterField(childField, fieldPathChecklist, fragmentSpreadChecklist, requestFieldPath, context)) {
        deleteChildFields(field, childField);
      }
    }
  }

  filterFragmentSpreads(field, fragmentSpreadFieldCounter, fragmentSpreadChecklist, ancestorRequestFieldPath);
  filterInlineFragments(field, context);
  filterIDsAndTypeNames(field, context);
  return !hasChildFields(field, { fragmentDefinitions });
};
