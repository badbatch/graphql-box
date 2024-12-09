import { type RequestData } from '@graphql-box/core';
import {
  buildFieldKeysAndPaths,
  deleteChildFields,
  getChildFields,
  getOperationDefinitions,
} from '@graphql-box/helpers';
import { type CacheManagerContext, type CachedResponseData } from '../types.ts';
import { createFragmentSpreadChecklist } from './createFragmentSpreadChecklist.ts';
import { filterField } from './filterField.ts';
import { filterFragmentDefinitions } from './filterFragmentDefinitions.ts';

export const filterQuery = (
  requestData: RequestData,
  { fieldPathChecklist }: CachedResponseData,
  context: CacheManagerContext,
) => {
  const { ast } = requestData;
  const queryNode = getOperationDefinitions(ast, context.operation)[0];

  if (!queryNode) {
    return ast;
  }

  const { fragmentDefinitions, operation } = context;
  const fieldsAndTypeNames = getChildFields(queryNode, { fragmentDefinitions });

  if (!fieldsAndTypeNames) {
    return ast;
  }

  const fragmentSpreadChecklist = createFragmentSpreadChecklist(requestData, context);

  for (let index = fieldsAndTypeNames.length - 1; index >= 0; index -= 1) {
    const { fieldNode } = fieldsAndTypeNames[index]!;

    const { requestFieldPath } = buildFieldKeysAndPaths(
      fieldNode,
      {
        requestFieldPath: operation,
      },
      context,
    );

    if (filterField(fieldNode, fieldPathChecklist, fragmentSpreadChecklist, requestFieldPath, context)) {
      deleteChildFields(queryNode, fieldNode);
    }
  }

  context.queryFiltered = true;
  return filterFragmentDefinitions(ast, fieldPathChecklist, fragmentSpreadChecklist, context);
};
