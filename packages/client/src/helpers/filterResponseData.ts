import {
  FragmentDefinitionNodeMap,
  MaybeResponseData,
  PlainObjectMap,
  QUERY,
  RequestContext,
  RequestData,
  ResponseData,
} from "@graphql-box/core";
import {
  KeysAndPathsOptions,
  buildFieldKeysAndPaths,
  getAliasOrName,
  getChildFields,
  getFragmentDefinitions,
  getOperationDefinitions,
  hasChildFields,
  iterateChildFields,
} from "@graphql-box/helpers";
import { FieldNode } from "graphql";
import { get, isArray, isPlainObject, isUndefined, set } from "lodash";
import { FilteredDataAndCacheMetadata } from "../defs";

export const filterDataAndCacheMetadata = (
  pendingFieldNode: FieldNode,
  activeFieldNode: FieldNode,
  activeResponseData: MaybeResponseData,
  { filteredData, filteredCacheMetadata }: FilteredDataAndCacheMetadata,
  fragmentDefinitions: { active?: FragmentDefinitionNodeMap; pending?: FragmentDefinitionNodeMap },
  keyAndPathOptions: { active: KeysAndPathsOptions; pending: KeysAndPathsOptions },
  contexts: { active: RequestContext; pending: RequestContext },
) => {
  const pendingKeysAndPaths = buildFieldKeysAndPaths(pendingFieldNode, keyAndPathOptions.active, contexts.pending);
  const activeKeysAndPaths = buildFieldKeysAndPaths(activeFieldNode, keyAndPathOptions.active, contexts.active);

  if (activeKeysAndPaths.requestFieldCacheKey !== pendingKeysAndPaths.requestFieldCacheKey) {
    return;
  }

  const rawFieldData = get(activeResponseData.data, activeKeysAndPaths.responseDataPath);
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

        activeChildFieldNode = matchingActiveFieldAndTypeName[0].fieldNode;
      } else {
        activeChildFieldNode = activeFieldNode;
      }

      filterDataAndCacheMetadata(
        pendingChildFieldNode,
        activeChildFieldNode,
        activeResponseData,
        { filteredData, filteredCacheMetadata },
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

export default (
  pendingRequestDatat: RequestData,
  activeRequestDatat: RequestData,
  { data, cacheMetadata, ...rest }: ResponseData,
  { active, pending }: { active: RequestContext; pending: RequestContext },
) => {
  const pendingQueryNode = getOperationDefinitions(pendingRequestDatat.ast, QUERY)[0];
  const pendingQueryFragmentDefinitions = getFragmentDefinitions(pendingRequestDatat.ast);
  const activeQueryNode = getOperationDefinitions(activeRequestDatat.ast, QUERY)[0];
  const activeQueryFragmentDefinitions = getFragmentDefinitions(activeRequestDatat.ast);

  const pendingFieldsAndTypeNames = getChildFields(pendingQueryNode, {
    fragmentDefinitions: pendingQueryFragmentDefinitions,
  });

  const filteredData: PlainObjectMap = {};
  const filteredCacheMetadata = new Map();

  pendingFieldsAndTypeNames?.forEach(({ fieldNode: pendingFieldNode }) => {
    const matchingActiveFieldAndTypeName = getChildFields(activeQueryNode, {
      fragmentDefinitions: activeQueryFragmentDefinitions,
      name: getAliasOrName(pendingFieldNode),
    });

    if (!matchingActiveFieldAndTypeName) {
      return;
    }

    const { fieldNode: activeFieldNode } = matchingActiveFieldAndTypeName[0];

    filterDataAndCacheMetadata(
      pendingFieldNode,
      activeFieldNode,
      { data, cacheMetadata, ...rest },
      { filteredData, filteredCacheMetadata },
      {
        active: activeQueryFragmentDefinitions,
        pending: pendingQueryFragmentDefinitions,
      },
      {
        active: { requestFieldPath: QUERY },
        pending: { requestFieldPath: QUERY },
      },
      { active, pending },
    );
  });

  return {
    ...rest,
    cacheMetadata: filteredCacheMetadata,
    data: filteredData,
  };
};
