import { type FieldTypeInfo, type PlainObject, type RequestContext } from '@graphql-box/core';
import { type FieldNode } from 'graphql';
import { isNumber, pickBy } from 'lodash-es';
import { hashRequest } from './hashRequest.ts';
import { getAliasOrName } from './parsing/aliasOrName.ts';
import { getArguments } from './parsing/arguments.ts';
import { type KeysAndPaths, type KeysAndPathsOptions } from './types.ts';

export const buildKey = (path: string, key: string | number) => {
  const paths: (string | number)[] = [];

  if (path.length > 0) {
    paths.push(path);
  }

  paths.push(key);
  return paths.join('.');
};

export const buildRequestFieldCacheKey = (
  name: string,
  requestFieldCacheKey: string,
  args: PlainObject | undefined,
  directives?: FieldTypeInfo['directives'],
  index?: number,
) => {
  let key = isNumber(index) ? String(index) : name;

  if (args) {
    key = `${key}(${JSON.stringify(pickBy(args, value => value !== undefined && value !== null))})`;
  }

  if (directives?.inherited.length) {
    key = `${directives.inherited.join(' ')} ${key}`;
  }

  if (directives?.own.length) {
    key = `${key} ${directives.own.join(' ')}`;
  }

  return buildKey(requestFieldCacheKey, key);
};

export const buildFieldKeysAndPaths = (
  field: FieldNode,
  options: KeysAndPathsOptions,
  context: RequestContext,
): KeysAndPaths => {
  const { index, requestFieldCacheKey = '', requestFieldPath = '', responseDataPath = '' } = options;
  const { value: name } = field.name;
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
