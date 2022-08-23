import { FieldTypeInfo, PlainObjectMap, RequestContext } from "@graphql-box/core";
import { FieldNode } from "graphql";
import { isNumber, pickBy } from "lodash";
import { KeysAndPaths, KeysAndPathsOptions } from "../defs";
import hashRequest from "../hash-request";
import { getAliasOrName } from "../parsing/alias-or-name";
import { getArguments } from "../parsing/arguments";
import { getName } from "../parsing/name";

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
    key = `${key}(${JSON.stringify(pickBy(args, value => value !== undefined && value !== null))})`;
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
  context: RequestContext,
): KeysAndPaths => {
  const { index, requestFieldCacheKey = "", requestFieldPath = "", responseDataPath = "" } = options;
  const name = getName(field) as FieldNode["name"]["value"];
  const fieldAliasOrName = getAliasOrName(field);
  const updatedRequestFieldPath = isNumber(index) ? requestFieldPath : buildKey(requestFieldPath, name);
  const fieldTypeInfo = context.fieldTypeMap.get(updatedRequestFieldPath);

  const updatedRequestFieldCacheKey = buildRequestFieldCacheKey(
    fieldAliasOrName,
    requestFieldCacheKey,
    getArguments(field),
    fieldTypeInfo?.directives,
    index,
  );

  const propNameOrIndex = isNumber(index) ? index : name;
  const updatedResponseDataPath = buildKey(responseDataPath, propNameOrIndex);

  return {
    hashedRequestFieldCacheKey: hashRequest(updatedRequestFieldCacheKey),
    propNameOrIndex,
    requestFieldCacheKey: updatedRequestFieldCacheKey,
    requestFieldPath: updatedRequestFieldPath,
    responseDataPath: updatedResponseDataPath,
  };
};
