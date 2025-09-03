import { hasChildFields, isKind, unwrapOfType } from '@graphql-box/helpers';
import {
  type DocumentNode,
  type FieldNode,
  type GraphQLSchema,
  Kind,
  OperationTypeNode,
  TypeInfo,
  visit,
  visitWithTypeInfo,
} from 'graphql';
import { FieldPathManager, type LeafFieldPathMetadata } from '#FieldPathManager.ts';
import { buildOperationHash } from '#helpers/buildOperationHash.ts';
import { directivesHasIncludeFalseOrSkipTrue } from '#helpers/directivesHasIncludeFalseOrSkipTrue.ts';
import { makeDepthChart } from '#helpers/makeDepthChart.ts';
import { type Ancestor } from '#types.ts';

const instrumentedOperationCache: Record<string, InstrumentOperationResult> = {};

export type InstrumentOperationOptions = {
  operation: string;
  operationType: OperationTypeNode;
};

export type InstrumentOperationResult = {
  depthChart: Record<string, number>;
  fieldPaths: Record<string, LeafFieldPathMetadata> | undefined;
  typeList: string[];
};

export const instrumentOperation = (
  ast: DocumentNode,
  schema: GraphQLSchema,
  { operation, operationType }: InstrumentOperationOptions,
): InstrumentOperationResult => {
  const operationHash = buildOperationHash(operation);

  if (instrumentedOperationCache[operationHash]) {
    return instrumentedOperationCache[operationHash];
  }

  const typeList: string[] = [];
  const depthChartAncestorsList: Ancestor[][] = [];
  const fieldPathManager = new FieldPathManager();
  const typeInfo = new TypeInfo(schema);

  visit(
    ast,
    visitWithTypeInfo(typeInfo, {
      enter: (node, _key, _parent, _path, ancestors) => {
        if (isKind<FieldNode>(node, Kind.FIELD)) {
          const type = typeInfo.getType();
          const unwrappedType = type ? unwrapOfType(type) : undefined;
          const fieldDef = typeInfo.getFieldDef();

          if (directivesHasIncludeFalseOrSkipTrue(node)) {
            return false;
          }

          if (unwrappedType && 'name' in unwrappedType) {
            typeList.push(unwrappedType.name);
          }

          if (!hasChildFields(node)) {
            depthChartAncestorsList.push([...ancestors, node]);
          }

          if (operationType === OperationTypeNode.QUERY && unwrappedType && fieldDef) {
            fieldPathManager.addPath(node, ancestors, {
              isTypeDefList: fieldDef.type.constructor.name === 'GraphQLList',
              isTypeScalar: unwrappedType.constructor.name === 'GraphQLScalarType',
              typeName: 'name' in unwrappedType ? unwrappedType.name : undefined,
            });
          }
        }

        return;
      },
    }),
  );

  const instruments = {
    depthChart: makeDepthChart(depthChartAncestorsList),
    fieldPaths: operationType === OperationTypeNode.QUERY ? fieldPathManager.leafFieldPaths : undefined,
    typeList,
  };

  instrumentedOperationCache[operationHash] = instruments;
  return instruments;
};
