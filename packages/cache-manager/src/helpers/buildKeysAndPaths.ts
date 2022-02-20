import { FieldTypeInfo, PlainObjectMap } from "@graphql-box/core";
import { getAlias, getArguments, getName, hashRequest } from "@graphql-box/helpers";
import { FieldNode } from "graphql";
import { isNumber } from "lodash";
import { CacheManagerContext, KeysAndPaths, KeysAndPathsOptions } from "../defs";

export const buildKey = (path: string, key: string | number) => {
  const paths: (string | number)[] = [];

  if (path.length) {
    paths.push(path);
  }

  paths.push(key);
  return paths.join(".");
};

export const buildRequestFieldCacheKey = (
  name: string,
  requestFieldCacheKey: string,
  args: PlainObjectMap | undefined,
  directives?: FieldTypeInfo["directives"],
  index?: number,
) => {
  let key = `${isNumber(index) ? index : name}`;

  if (args) {
    key = `${key}(${JSON.stringify(args)})`;
  }

  if (directives?.inherited?.length) {
    key = `${directives.inherited.join(" ")} ${key}`;
  }

  if (directives?.own?.length) {
    key = `${key} ${directives.own.join(" ")}`;
  }

  return buildKey(requestFieldCacheKey, key);
};

export const buildFieldKeysAndPaths = (
  field: FieldNode,
  options: KeysAndPathsOptions,
  context: CacheManagerContext,
): KeysAndPaths => {
  const name = getName(field) as FieldNode["name"]["value"];
  const { index, requestFieldCacheKey = "", requestFieldPath = "", responseDataPath = "" } = options;
  const fieldAliasOrName = getAlias(field) || name;
  const updatedRequestFieldPath = isNumber(index) ? requestFieldPath : buildKey(requestFieldPath, fieldAliasOrName);
  const fieldTypeInfo = context.fieldTypeMap.get(updatedRequestFieldPath);

  const updatedRequestFieldCacheKey = buildRequestFieldCacheKey(
    name,
    requestFieldCacheKey,
    getArguments(field),
    fieldTypeInfo?.directives,
    index,
  );

  const propNameOrIndex = isNumber(index) ? index : fieldAliasOrName;
  const updatedResponseDataPath = buildKey(responseDataPath, propNameOrIndex);

  return {
    hashedRequestFieldCacheKey: hashRequest(updatedRequestFieldCacheKey),
    propNameOrIndex,
    requestFieldCacheKey: updatedRequestFieldCacheKey,
    requestFieldPath: updatedRequestFieldPath,
    responseDataPath: updatedResponseDataPath,
  };
};
