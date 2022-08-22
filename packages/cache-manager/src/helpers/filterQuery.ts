import { RequestData } from "@graphql-box/core";
import {
  buildFieldKeysAndPaths,
  deleteChildFields,
  getChildFields,
  getOperationDefinitions,
} from "@graphql-box/helpers";
import { CacheManagerContext, CachedResponseData } from "../defs";
import createFragmentSpreadChecklist from "./createFragmentSpreadChecklist";
import filterField from "./filterField";
import filterFragmentDefinitions from "./filterFragmentDefinitions";

export default (requestData: RequestData, { fieldPathChecklist }: CachedResponseData, context: CacheManagerContext) => {
  const { ast } = requestData;
  const queryNode = getOperationDefinitions(ast, context.operation)[0];
  const { fragmentDefinitions } = context;
  const fieldsAndTypeNames = getChildFields(queryNode, { fragmentDefinitions });

  if (!fieldsAndTypeNames) {
    return ast;
  }

  const fragmentSpreadChecklist = createFragmentSpreadChecklist(requestData, context);

  for (let i = fieldsAndTypeNames.length - 1; i >= 0; i -= 1) {
    const { fieldNode } = fieldsAndTypeNames[i];

    const { requestFieldPath } = buildFieldKeysAndPaths(
      fieldNode,
      {
        requestFieldPath: context.operation,
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
