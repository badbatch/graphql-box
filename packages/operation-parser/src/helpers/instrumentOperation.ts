import { type FieldPathMetadata } from '@graphql-box/core';
import { getAlias, hasArguments, isKind } from '@graphql-box/helpers';
import {
  type DocumentNode,
  type FieldNode,
  type GraphQLSchema,
  type InlineFragmentNode,
  Kind,
  type OperationDefinitionNode,
  OperationTypeNode,
  TypeInfo,
  getNamedType,
  isInterfaceType,
  isLeafType,
  isListType,
  isObjectType,
  isUnionType,
  visit,
  visitWithTypeInfo,
} from 'graphql';
import { FieldPathManager } from '#FieldPathManager.ts';
import { addFieldNode } from '#helpers/addFieldNode.ts';
import { buildPathCacheKey } from '#helpers/buildPathCacheKey.ts';
import { isTypeEntity } from '#helpers/isTypeEntity.ts';
import { sortSelections } from '#helpers/sortSelections.ts';

// const instrumentedOperationCache: Record<string, InstrumentOperationResult> = {};

export type InstrumentOperationOptions = {
  idKey: string;
  operation: string;
  operationType: OperationTypeNode;
};

export type InstrumentOperationResult = {
  depthChart: Record<string, number>;
  fieldPaths: Record<string, FieldPathMetadata>;
  instrumentedAst: DocumentNode;
  typeOccurrences: Record<string, number>;
};

export const instrumentOperation = (
  ast: DocumentNode,
  schema: GraphQLSchema,
  { idKey, operationType }: InstrumentOperationOptions,
): InstrumentOperationResult => {
  // const operationHash = buildOperationHash(operation);

  // if (instrumentedOperationCache[operationHash]) {
  //   return instrumentedOperationCache[operationHash];
  // }

  const typeOccurrences: Record<string, number> = {};
  const fieldPathManager = new FieldPathManager(schema);
  const typeInfo = new TypeInfo(schema);
  const fieldPathStack: string[] = [];
  const concreteTypeStack: string[] = [];
  const entityStack: string[] = [];
  const depthChart: Record<string, number> = {};

  const instrumentedAst = visit(
    ast,
    visitWithTypeInfo(typeInfo, {
      enter: (node, _key, _parent, _path) => {
        const type = typeInfo.getType();

        if (isKind<FieldNode>(node, Kind.FIELD)) {
          fieldPathStack.push(getAlias(node) ?? node.name.value);
          const namedType = getNamedType(type);
          const isEntity = isTypeEntity(namedType, idKey);

          if (
            isEntity &&
            ((!isInterfaceType(namedType) && !isUnionType(namedType)) ||
              (isInterfaceType(namedType) &&
                !node.selectionSet?.selections.some(s => isKind<InlineFragmentNode>(s, Kind.INLINE_FRAGMENT))))
          ) {
            addFieldNode(node, idKey);
          }

          if (isEntity || isInterfaceType(namedType) || isUnionType(namedType)) {
            addFieldNode(node, '__typename');
          }

          if (isObjectType(namedType)) {
            const occurrences = typeOccurrences[namedType.name] ?? 0;
            typeOccurrences[namedType.name] = occurrences + 1;
          }

          if (!node.selectionSet) {
            const path = fieldPathStack.join('.');
            depthChart[path] = Math.max(depthChart[path] ?? 0, fieldPathStack.length);
          }

          if (operationType !== OperationTypeNode.QUERY) {
            return;
          }

          if (namedType && isEntity) {
            entityStack.push(namedType.name);
          }
        }

        if (isKind<InlineFragmentNode>(node, Kind.INLINE_FRAGMENT) && node.typeCondition) {
          const { value: typeConditionValue } = node.typeCondition.name;
          const namedType = schema.getType(typeConditionValue);

          if (isTypeEntity(namedType, idKey)) {
            addFieldNode(node, idKey);
          }

          concreteTypeStack.push(typeConditionValue);
          typeOccurrences[typeConditionValue] = (typeOccurrences[typeConditionValue] ?? 0) + 1;
        }
      },
      leave: node => {
        if (
          (isKind<FieldNode>(node, Kind.FIELD) ||
            isKind<InlineFragmentNode>(node, Kind.INLINE_FRAGMENT) ||
            isKind<OperationDefinitionNode>(node, Kind.OPERATION_DEFINITION)) &&
          node.selectionSet
        ) {
          node.selectionSet.selections = sortSelections(node.selectionSet.selections);
        }

        const type = typeInfo.getType();
        const namedType = getNamedType(type);

        if (isKind<FieldNode>(node, Kind.FIELD)) {
          const isEntity = isTypeEntity(namedType, idKey);
          const isLeaf = isLeafType(namedType);
          const isList = isListType(type);
          const hasArgs = hasArguments(node);
          const parentType = typeInfo.getParentType();
          const namedParentType = getNamedType(parentType);
          const isAbstract = isInterfaceType(namedParentType) || isUnionType(namedParentType);
          const isRootPath = fieldPathStack.length === 1;

          if (namedType && (isEntity || isLeaf || isList || hasArgs || isRootPath)) {
            const leafEntity = isLeaf ? entityStack.at(-1) : undefined;

            fieldPathManager.addFieldPath(node, {
              fieldDepth: fieldPathStack.length,
              fieldPathStack,
              hasArgs,
              isAbstract,
              isEntity,
              isLeaf,
              isList,
              isRootPath: fieldPathStack.length === 1,
              leafEntity,
              pathCacheKey: buildPathCacheKey(node, { isList }),
              pathResponseKey: getAlias(node) ?? node.name.value,
              typeConditions: [...concreteTypeStack],
              typeName: namedType.name,
            });
          }

          fieldPathStack.pop();

          if (isTypeEntity(namedType, idKey)) {
            entityStack.pop();
          }
        }

        if (isKind<InlineFragmentNode>(node, Kind.INLINE_FRAGMENT)) {
          concreteTypeStack.pop();
        }
      },
    }),
  );

  const instruments = {
    depthChart,
    fieldPaths: fieldPathManager.fieldPaths,
    instrumentedAst,
    typeOccurrences,
  };

  // instrumentedOperationCache[operationHash] = instruments;
  return instruments;
};
