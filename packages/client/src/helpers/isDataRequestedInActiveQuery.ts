import { FragmentDefinitionNodeMap, QUERY, RequestContext, RequestData } from "@graphql-box/core";
import {
  FieldAndTypeName,
  KeysAndPathsOptions,
  ParentNode,
  buildFieldKeysAndPaths,
  getAliasOrName,
  getChildFields,
  getFragmentDefinitions,
  getName,
  getOperationDefinitions,
  hasChildFields,
} from "@graphql-box/helpers";
import { ActiveQueryData } from "../defs";

const LOG_NAME = "isDataRequestedInActiveQuery";

export const parentNodeIncludes = (
  activeNode: ParentNode,
  newNode: ParentNode,
  fragmentDefinitions: { control?: FragmentDefinitionNodeMap; value?: FragmentDefinitionNodeMap },
  contexts: { active: RequestContext; new: RequestContext },
) => {
  const activeNodeFieldsAndTypeNames = getChildFields(activeNode, {
    fragmentDefinitions: fragmentDefinitions.control,
  });

  const newNodeFieldsAndTypeNames = getChildFields(newNode, {
    fragmentDefinitions: fragmentDefinitions.value,
  });

  if (!activeNodeFieldsAndTypeNames || !newNodeFieldsAndTypeNames) {
    return false;
  }

  return newNodeFieldsAndTypeNames.every(({ fieldNode: newFieldNode }) => {
    const name = getAliasOrName(newFieldNode);

    if (
      !activeNodeFieldsAndTypeNames.find(({ fieldNode: activeFieldNode }) => getAliasOrName(activeFieldNode) === name)
    ) {
      contexts.new.debugManager?.log(
        LOG_NAME,
        {
          context: contexts.new,
          message: `Active parent node ${getName(activeNode)} is missing field ${name}`,
        },
        "debug",
      );

      return false;
    }

    return true;
  });
};

export const newNodeFieldsPartOfActiveNode = (
  activeNode: ParentNode,
  newNode: ParentNode,
  fragmentDefinitions: { active?: FragmentDefinitionNodeMap; new?: FragmentDefinitionNodeMap },
  keyAndPathOptions: { active: KeysAndPathsOptions; new: KeysAndPathsOptions },
  contexts: { active: RequestContext; new: RequestContext },
): boolean => {
  const activeNodeHasNewNodeFields = parentNodeIncludes(
    activeNode,
    newNode,
    {
      control: fragmentDefinitions.active,
      value: fragmentDefinitions.new,
    },
    contexts,
  );

  if (!activeNodeHasNewNodeFields) {
    return false;
  }

  const newNodeFieldsAndTypeNames = getChildFields(newNode, {
    fragmentDefinitions: fragmentDefinitions.new,
  }) as FieldAndTypeName[];

  return newNodeFieldsAndTypeNames.reduce((acc: boolean, { fieldNode: newFieldNode }) => {
    if (!acc) {
      return false;
    }

    const matchingActiveFieldAndTypeName = getChildFields(activeNode, {
      fragmentDefinitions: fragmentDefinitions.active,
      name: getAliasOrName(newFieldNode),
    });

    if (!matchingActiveFieldAndTypeName?.length) {
      return false;
    }

    const { fieldNode: activeFieldNode } = matchingActiveFieldAndTypeName[0];

    const activeKeysAndPaths = buildFieldKeysAndPaths(activeFieldNode, keyAndPathOptions.active, contexts.active);
    const newKeysAndPaths = buildFieldKeysAndPaths(newFieldNode, keyAndPathOptions.active, contexts.new);

    if (activeKeysAndPaths.requestFieldCacheKey !== newKeysAndPaths.requestFieldCacheKey) {
      let message = `${newKeysAndPaths.requestFieldPath} active and new request field cache keys do not match.`;
      message += `Active is ${activeKeysAndPaths.requestFieldCacheKey}. New is ${newKeysAndPaths.requestFieldCacheKey}`;
      contexts.new.debugManager?.log(LOG_NAME, { message, context: contexts.new }, "debug");
      return false;
    }

    if (!hasChildFields(newFieldNode, { fragmentDefinitions: fragmentDefinitions.new })) {
      return true;
    }

    return newNodeFieldsPartOfActiveNode(
      activeFieldNode,
      newFieldNode,
      fragmentDefinitions,
      { active: activeKeysAndPaths, new: newKeysAndPaths },
      contexts,
    );
  }, true);
};

export default (activeRequestList: ActiveQueryData[], newRequestData: RequestData, context: RequestContext) => {
  const match = activeRequestList.find(({ context: activeContext, requestData: activeRequestData }) => {
    const activeQueryNode = getOperationDefinitions(activeRequestData.ast, QUERY)[0];
    const activeQueryFragmentDefinitions = getFragmentDefinitions(activeRequestData.ast);
    const newQueryNode = getOperationDefinitions(newRequestData.ast, QUERY)[0];
    const newQueryFragmentDefinitions = getFragmentDefinitions(newRequestData.ast);

    return newNodeFieldsPartOfActiveNode(
      activeQueryNode,
      newQueryNode,
      {
        active: activeQueryFragmentDefinitions,
        new: newQueryFragmentDefinitions,
      },
      {
        active: { requestFieldPath: QUERY },
        new: { requestFieldPath: QUERY },
      },
      {
        active: activeContext,
        new: context,
      },
    );
  });

  return match?.requestData.hash;
};
