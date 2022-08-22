import { PlainObjectMap } from "@graphql-box/core";
import { KeysAndPaths, buildFieldKeysAndPaths, getName, resolveFragments } from "@graphql-box/helpers";
import { FieldNode, SelectionNode } from "graphql";
import { keys } from "lodash";
import { CacheManagerContext } from "../defs";

export default (
  fieldData: PlainObjectMap,
  selectionNodes: readonly SelectionNode[],
  ancestorKeysAndPaths: KeysAndPaths,
  context: CacheManagerContext,
) => {
  const fieldAndTypeName = resolveFragments(selectionNodes, context.fragmentDefinitions);

  return keys(fieldData).reduce((acc: PlainObjectMap, key) => {
    const match = fieldAndTypeName.find(({ fieldNode }) => (getName(fieldNode) as FieldNode["name"]["value"]) === key);

    if (match) {
      const { requestFieldPath } = buildFieldKeysAndPaths(match.fieldNode, ancestorKeysAndPaths, context);
      const fieldTypeInfo = context.fieldTypeMap.get(requestFieldPath);

      if (!fieldTypeInfo?.hasArguments && !fieldTypeInfo?.hasDirectives) {
        acc[key] = fieldData[key];
      }
    }

    return acc;
  }, {});
};
