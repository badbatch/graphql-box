import { type FragmentDefinitionNodeMap, type RequestContext, type RequestData } from '@graphql-box/core';
import {
  type KeysAndPathsOptions,
  type ParentNode,
  buildFieldKeysAndPaths,
  getAliasOrName,
  getChildFields,
  getFragmentDefinitions,
  getOperationDefinitions,
  hasChildFields,
} from '@graphql-box/helpers';
import { OperationTypeNode } from 'graphql';
import { type ActiveQueryData } from '../types.ts';

export const parentNodeIncludes = (
  activeNode: ParentNode,
  newNode: ParentNode,
  fragmentDefinitions: { control?: FragmentDefinitionNodeMap; value?: FragmentDefinitionNodeMap },
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
      !activeNodeFieldsAndTypeNames.some(({ fieldNode: activeFieldNode }) => getAliasOrName(activeFieldNode) === name)
    ) {
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
  const activeNodeHasNewNodeFields = parentNodeIncludes(activeNode, newNode, {
    control: fragmentDefinitions.active,
    value: fragmentDefinitions.new,
  });

  if (!activeNodeHasNewNodeFields) {
    return false;
  }

  const newNodeFieldsAndTypeNames =
    getChildFields(newNode, {
      fragmentDefinitions: fragmentDefinitions.new,
    }) ?? [];

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

    const [match] = matchingActiveFieldAndTypeName;

    if (!match) {
      return false;
    }

    const { fieldNode: activeFieldNode } = match;
    const activeKeysAndPaths = buildFieldKeysAndPaths(activeFieldNode, keyAndPathOptions.active, contexts.active);
    const newKeysAndPaths = buildFieldKeysAndPaths(newFieldNode, keyAndPathOptions.active, contexts.new);

    if (activeKeysAndPaths.requestFieldCacheKey !== newKeysAndPaths.requestFieldCacheKey) {
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

export const isDataRequestedInActiveQuery = (
  activeRequestList: ActiveQueryData[],
  newRequestData: RequestData,
  context: RequestContext,
) => {
  const match = activeRequestList.find(({ context: activeContext, requestData: activeRequestData }) => {
    const [activeQueryNode] = getOperationDefinitions(activeRequestData.ast, OperationTypeNode.QUERY);
    const activeQueryFragmentDefinitions = getFragmentDefinitions(activeRequestData.ast);
    const [newQueryNode] = getOperationDefinitions(newRequestData.ast, OperationTypeNode.QUERY);
    const newQueryFragmentDefinitions = getFragmentDefinitions(newRequestData.ast);

    if (!activeQueryNode || !newQueryNode) {
      return false;
    }

    return newNodeFieldsPartOfActiveNode(
      activeQueryNode,
      newQueryNode,
      {
        active: activeQueryFragmentDefinitions,
        new: newQueryFragmentDefinitions,
      },
      {
        active: { requestFieldPath: OperationTypeNode.QUERY },
        new: { requestFieldPath: OperationTypeNode.QUERY },
      },
      {
        active: activeContext,
        new: context,
      },
    );
  });

  return match?.requestData.hash;
};
