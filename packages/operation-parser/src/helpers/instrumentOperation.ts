import { hasArguments, isKind } from '@graphql-box/helpers';
import {
  type DocumentNode,
  type FieldNode,
  type GraphQLSchema,
  type InlineFragmentNode,
  Kind,
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
import { FieldPathManager, type FieldPathMetadata } from '#FieldPathManager.ts';
import { buildOperationHash } from '#helpers/buildOperationHash.ts';
import { isTypeEntity } from '#helpers/isTypeEntity.ts';

const instrumentedOperationCache: Record<string, InstrumentOperationResult> = {};

export type InstrumentOperationOptions = {
  idKey: string;
  operation: string;
  operationType: OperationTypeNode;
};

export type InstrumentOperationResult = {
  depthChart: Record<string, number>;
  fieldPaths: Record<string, FieldPathMetadata>;
  typeOccurrences: Record<string, number>;
};

export const instrumentOperation = (
  ast: DocumentNode,
  schema: GraphQLSchema,
  { idKey, operation, operationType }: InstrumentOperationOptions,
): InstrumentOperationResult => {
  const operationHash = buildOperationHash(operation);

  if (instrumentedOperationCache[operationHash]) {
    return instrumentedOperationCache[operationHash];
  }

  const typeOccurrences: Record<string, number> = {};
  const fieldPathManager = new FieldPathManager();
  const typeInfo = new TypeInfo(schema);
  const fieldPathStack: string[] = [];
  const concreteTypeStack: string[] = [];
  const entityStack: string[] = [];
  const depthChart: Record<string, number> = {};

  visit(
    ast,
    visitWithTypeInfo(typeInfo, {
      enter: (node, _key, _parent, _path) => {
        const type = typeInfo.getType();

        if (isKind<FieldNode>(node, Kind.FIELD)) {
          fieldPathStack.push(node.name.value);
          const namedType = getNamedType(type);

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

          const isEntity = isTypeEntity(namedType, idKey);
          const isLeaf = isLeafType(namedType);
          const isList = isListType(type);
          const hasArgs = hasArguments(node);
          const parentType = typeInfo.getParentType();
          const namedParentType = getNamedType(parentType);
          const isAbstract = isInterfaceType(namedParentType) || isUnionType(namedParentType);

          if (namedType && isEntity) {
            entityStack.push(namedType.name);
          }

          if (namedType && (isEntity || isLeaf || isList || hasArgs)) {
            const leafEntity = isLeaf ? entityStack.at(-1) : undefined;

            fieldPathManager.addFieldPath(node, {
              fieldPathStack,
              hasArgs,
              isAbstract,
              isEntity,
              isLeaf,
              isList,
              leafEntity,
              typeConditions: [...concreteTypeStack],
              typeName: namedType.name,
            });
          }
        }

        if (isKind<InlineFragmentNode>(node, Kind.INLINE_FRAGMENT) && node.typeCondition) {
          const { value: typeConditionValue } = node.typeCondition.name;
          concreteTypeStack.push(typeConditionValue);
          typeOccurrences[typeConditionValue] = (typeOccurrences[typeConditionValue] ?? 0) + 1;
        }

        return;
      },
      leave: node => {
        const type = typeInfo.getType();

        if (isKind<FieldNode>(node, Kind.FIELD)) {
          fieldPathStack.pop();
          const namedType = getNamedType(type);

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
    typeOccurrences,
  };

  instrumentedOperationCache[operationHash] = instruments;
  return instruments;
};
