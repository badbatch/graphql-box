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
  const queryNode = getOperationDefinitions(ast, context.data.operation)[0];

  if (!queryNode) {
    return ast;
  }

  const { data, fragmentDefinitions } = context;
  const fieldsAndTypeNames = getChildFields(queryNode, { fragmentDefinitions });

  if (!fieldsAndTypeNames) {
    return ast;
  }

  const fragmentSpreadChecklist = createFragmentSpreadChecklist(requestData, context);

  for (let index = fieldsAndTypeNames.length - 1; index >= 0; index -= 1) {
    // In this context fieldsAndTypeNames[index] will not be undefined
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { fieldNode } = fieldsAndTypeNames[index]!;

    const { requestFieldPath } = buildFieldKeysAndPaths(
      fieldNode,
      {
        requestFieldPath: data.operation,
      },
      context,
    );

    if (filterField(fieldNode, fieldPathChecklist, fragmentSpreadChecklist, requestFieldPath, context)) {
      deleteChildFields(queryNode, fieldNode);
    }
  }

  context.data.queryFiltered = true;
  return filterFragmentDefinitions(ast, fieldPathChecklist, fragmentSpreadChecklist, context);
};
