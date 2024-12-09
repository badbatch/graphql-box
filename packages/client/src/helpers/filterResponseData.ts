import {
  type FragmentDefinitionNodeMap,
  type PartialResponseData,
  type PlainData,
  type RequestContext,
  type RequestData,
  type ResponseData,
} from '@graphql-box/core';
import {
  type KeysAndPathsOptions,
  buildFieldKeysAndPaths,
  getAliasOrName,
  getChildFields,
  getFragmentDefinitions,
  getOperationDefinitions,
  hasChildFields,
  isObjectLike,
  isPlainObject,
  iterateChildFields,
} from '@graphql-box/helpers';
import { type Cacheability } from 'cacheability';
import { type FieldNode, OperationTypeNode } from 'graphql';
import { get, isArray, isUndefined, set } from 'lodash-es';
import { type FilteredDataAndCacheMetadata } from '../types.ts';

export const filterDataAndCacheMetadata = (
  pendingFieldNode: FieldNode,
  activeFieldNode: FieldNode,
  activeResponseData: PartialResponseData,
  { filteredCacheMetadata, filteredData }: FilteredDataAndCacheMetadata,
  fragmentDefinitions: { active?: FragmentDefinitionNodeMap; pending?: FragmentDefinitionNodeMap },
  keyAndPathOptions: { active: KeysAndPathsOptions; pending: KeysAndPathsOptions },
  contexts: { active: RequestContext; pending: RequestContext },
) => {
  const pendingKeysAndPaths = buildFieldKeysAndPaths(pendingFieldNode, keyAndPathOptions.active, contexts.pending);
  const activeKeysAndPaths = buildFieldKeysAndPaths(activeFieldNode, keyAndPathOptions.active, contexts.active);

  if (activeKeysAndPaths.requestFieldCacheKey !== pendingKeysAndPaths.requestFieldCacheKey) {
    return;
  }

  const rawFieldData = get(activeResponseData.data, activeKeysAndPaths.responseDataPath) as unknown;
  let activeFieldData = rawFieldData;

  if (isPlainObject(activeFieldData)) {
    activeFieldData = {};
  } else if (isArray(activeFieldData)) {
    activeFieldData = [];
  }

  set(filteredData, pendingKeysAndPaths.responseDataPath, activeFieldData);
  const cacheability = activeResponseData.cacheMetadata?.get(activeKeysAndPaths.requestFieldPath);

  if (cacheability) {
    filteredCacheMetadata.set(pendingKeysAndPaths.requestFieldPath, cacheability);
  }

  if (!hasChildFields(pendingFieldNode, { fragmentDefinitions: fragmentDefinitions.pending })) {
    return;
  }

  if (!isObjectLike(rawFieldData)) {
    return;
  }

  iterateChildFields(
    pendingFieldNode,
    rawFieldData,
    fragmentDefinitions.pending,
    (
      pendingChildFieldNode: FieldNode,
      _childTypeName: string | undefined,
      _childFragmentKind: string | undefined,
      _childFragmentName: string | undefined,
      childIndex?: number,
    ) => {
      let activeChildFieldNode: FieldNode;

      if (isUndefined(childIndex)) {
        const matchingActiveFieldAndTypeName = getChildFields(activeFieldNode, {
          fragmentDefinitions: fragmentDefinitions.active,
          name: getAliasOrName(pendingChildFieldNode),
        });

        if (!matchingActiveFieldAndTypeName?.length) {
          return;
        }

        const [match] = matchingActiveFieldAndTypeName;

        if (!match) {
          return;
        }

        activeChildFieldNode = match.fieldNode;
      } else {
        activeChildFieldNode = activeFieldNode;
      }

      filterDataAndCacheMetadata(
        pendingChildFieldNode,
        activeChildFieldNode,
        activeResponseData,
        { filteredCacheMetadata, filteredData },
        fragmentDefinitions,
        {
          active: { ...activeKeysAndPaths, index: childIndex },
          pending: { ...pendingKeysAndPaths, index: childIndex },
        },
        contexts,
      );
    },
  );
};

export const filterResponseData = (
  pendingRequestDatat: RequestData,
  activeRequestDatat: RequestData,
  { cacheMetadata, data, ...rest }: ResponseData,
  { active, pending }: { active: RequestContext; pending: RequestContext },
) => {
  const [pendingQueryNode] = getOperationDefinitions(pendingRequestDatat.ast, OperationTypeNode.QUERY);
  const pendingQueryFragmentDefinitions = getFragmentDefinitions(pendingRequestDatat.ast);
  const [activeQueryNode] = getOperationDefinitions(activeRequestDatat.ast, OperationTypeNode.QUERY);
  const activeQueryFragmentDefinitions = getFragmentDefinitions(activeRequestDatat.ast);

  if (!pendingQueryNode || !activeQueryNode) {
    return { cacheMetadata, data, ...rest };
  }

  const pendingFieldsAndTypeNames = getChildFields(pendingQueryNode, {
    fragmentDefinitions: pendingQueryFragmentDefinitions,
  });

  const filteredData: PlainData = {};
  const filteredCacheMetadata = new Map<string, Cacheability>();

  if (pendingFieldsAndTypeNames) {
    for (const { fieldNode: pendingFieldNode } of pendingFieldsAndTypeNames) {
      const matchingActiveFieldAndTypeName = getChildFields(activeQueryNode, {
        fragmentDefinitions: activeQueryFragmentDefinitions,
        name: getAliasOrName(pendingFieldNode),
      });

      if (!matchingActiveFieldAndTypeName?.length) {
        continue;
      }

      const [match] = matchingActiveFieldAndTypeName;

      if (!match) {
        continue;
      }

      const { fieldNode: activeFieldNode } = match;

      filterDataAndCacheMetadata(
        pendingFieldNode,
        activeFieldNode,
        { cacheMetadata, data, ...rest },
        { filteredCacheMetadata, filteredData },
        {
          active: activeQueryFragmentDefinitions,
          pending: pendingQueryFragmentDefinitions,
        },
        {
          active: { requestFieldPath: OperationTypeNode.QUERY },
          pending: { requestFieldPath: OperationTypeNode.QUERY },
        },
        { active, pending },
      );
    }
  }

  return {
    ...rest,
    cacheMetadata: filteredCacheMetadata,
    data: filteredData,
  };
};
