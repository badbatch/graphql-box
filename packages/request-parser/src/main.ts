import {
  DEFAULT_TYPE_ID_KEY,
  type FragmentDefinitionNodeMap,
  type Maybe,
  type PlainArray,
  type PlainData,
  type PlainObject,
  type RequestContext,
  type RequestOptions,
  TYPE_NAME_KEY,
  type VariableTypesMap,
} from '@graphql-box/core';
import {
  ArgsError,
  GroupedError,
  type ParsedDirective,
  addChildField,
  deleteFragmentDefinitions,
  getAlias,
  getArguments,
  getChildFields,
  getFieldDirectives,
  getFragmentDefinitions,
  getInlineFragmentDirectives,
  getKind,
  getOperationDefinitions,
  getType,
  getVariableDefinitionDefaultValue,
  getVariableDefinitionType,
  hasChildFields,
  isKind,
  isObjectLike,
  isPlainObject,
  setFragments,
  unwrapOfType,
} from '@graphql-box/helpers';
import {
  type ASTNode,
  type DocumentNode,
  type FieldNode,
  type FragmentDefinitionNode,
  type FragmentSpreadNode,
  GraphQLEnumType,
  GraphQLInterfaceType,
  type GraphQLNamedType,
  type GraphQLOutputType,
  GraphQLSchema,
  GraphQLUnionType,
  type InlineFragmentNode,
  Kind,
  OperationTypeNode,
  TypeInfo,
  type ValueNode,
  type VariableDefinitionNode,
  type VariableNode,
  buildClientSchema,
  parse,
  parseValue,
  print,
  validate,
  visit,
} from 'graphql';
import { assign, get, isEmpty, isError, isString } from 'lodash-es';
import { calcTypeComplexity } from './helpers/calcTypeComplexity.ts';
import { findAncestorFragmentDefinition } from './helpers/findAncestorFragmentDefinition.ts';
import { getMaxDepthFromChart } from './helpers/getMaxDepthFromChart.ts';
import { getPersistedFragmentSpreadNames } from './helpers/getPersistedFragmentSpreadNames.ts';
import { getPossibleTypeDetails } from './helpers/getPossibleTypeDetails.ts';
import { isAncestorAstNode } from './helpers/isAncestorAstNode.ts';
import { isAncestorFragmentDefinition } from './helpers/isAncestorFragmentDefinition.ts';
import { isTypeEntity } from './helpers/isTypeEntity.ts';
import { makeDepthChart } from './helpers/makeDepthChart.ts';
import { reorderDefinitions } from './helpers/reorderDefinitions.ts';
import { setFragmentAndDirectiveContextProps } from './helpers/setFragmentAndDirectiveContextProps.ts';
import { sliceAncestorsFromFragmentDefinition } from './helpers/sliceAncestorsFromFragmentDefinition.ts';
import { toUpdateNode } from './helpers/toUpdateNode.ts';
import { updateFragmentSpreadNode } from './helpers/updateFragmentSpreadNode.ts';
import {
  type Ancestor,
  type Ancestors,
  type MapFieldToTypeData,
  type RequestParserDef,
  type UpdateRequestResult,
  type UserOptions,
  type VisitorContext,
} from './types.ts';

export class RequestParser implements RequestParserDef {
  private static _concatFragments(query: string, fragments: string[]): string {
    return [query, ...fragments].join('\n\n');
  }

  private static _mapFieldToType(
    data: MapFieldToTypeData,
    { variables }: RequestOptions,
    context: VisitorContext,
  ): void {
    const { ancestors, directives, fieldNode, isEntity, isInterface, isUnion, possibleTypes, typeIDKey, typeName } =
      data;

    const { fieldTypeMap, operation } = context;
    const ancestorRequestFieldPath: string[] = [operation];

    const isAncestorFieldNode = (ancestor: Ancestor): ancestor is FieldNode =>
      isAncestorAstNode(ancestor) && getKind(ancestor) === Kind.FIELD;

    for (const ancestor of ancestors) {
      if (isAncestorFieldNode(ancestor)) {
        ancestorRequestFieldPath.push(getAlias(ancestor) ?? ancestor.name.value);
      }
    }

    const fieldName = getAlias(fieldNode) ?? fieldNode.name.value;
    ancestorRequestFieldPath.push(fieldName);
    const requestFieldPath = ancestorRequestFieldPath.join('.');
    const argumentsObjectMap = getArguments(fieldNode);
    let typeIDValue: string | number | undefined;

    if (argumentsObjectMap) {
      if (argumentsObjectMap[typeIDKey]) {
        // Need to refactor to remove casting
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        typeIDValue = argumentsObjectMap[typeIDKey] as string | number;
      } else if (variables?.[typeIDKey]) {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        typeIDValue = variables[typeIDKey] as string | number;
      }
    }

    fieldTypeMap.set(requestFieldPath, {
      directives,
      hasArguments: !!argumentsObjectMap,
      hasDirectives: !(isEmpty(directives.inherited) && isEmpty(directives.own)),
      isEntity,
      isInterface,
      isUnion,
      possibleTypes,
      typeIDValue,
      typeName,
    });
  }

  private static _parseArrayToInputString(values: PlainArray, variableType: Maybe<GraphQLNamedType>): string {
    let inputString = '[';

    for (const [index, value] of values.entries()) {
      if (isObjectLike(value)) {
        inputString += RequestParser._parseToInputString(value, variableType);
      } else {
        const sanitizedValue =
          isString(value) && !(variableType instanceof GraphQLEnumType) ? `"${value}"` : String(value);

        inputString += sanitizedValue;
      }

      if (index < values.length - 1) {
        inputString += ',';
      }
    }

    inputString += ']';
    return inputString;
  }

  private static _parseObjectToInputString(obj: PlainObject, variableType: Maybe<GraphQLNamedType>): string {
    let inputString = '{';
    const keys = Object.keys(obj);

    for (const [index, key] of keys.entries()) {
      inputString += `${key}:`;
      const value = obj[key];

      if (isObjectLike(value)) {
        inputString += RequestParser._parseToInputString(value, variableType);
      } else {
        inputString += isString(value) ? `"${value}"` : String(value);
      }

      if (index < keys.length - 1) {
        inputString += ',';
      }
    }

    inputString += '}';
    return inputString;
  }

  private static _parseToInputString(value: PlainData, variableType: Maybe<GraphQLNamedType>): string {
    if (isPlainObject(value)) {
      return RequestParser._parseObjectToInputString(value, variableType);
    }

    return RequestParser._parseArrayToInputString(value, variableType);
  }

  private static _updateVariableNode(
    node: VariableNode,
    variableType: Maybe<GraphQLNamedType>,
    { variables }: RequestOptions,
  ): ValueNode {
    if (!variables) {
      return parseValue('null');
    }

    const name = node.name.value;
    const value = variables[name];

    if (!value) {
      return parseValue('null');
    }

    if (isObjectLike(value)) {
      return parseValue(RequestParser._parseToInputString(value, variableType));
    }

    // This should be okay, but need to check test coverage
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const sanitizedValue = isString(value) && !(variableType instanceof GraphQLEnumType) ? `"${value}"` : String(value);
    return parseValue(sanitizedValue);
  }

  private readonly _maxFieldDepth: number;
  private readonly _maxTypeComplexity: number;
  private readonly _schema: GraphQLSchema;
  private readonly _typeComplexityMap: Record<string, number> | null;
  private readonly _typeIDKey: string;

  constructor(options: UserOptions) {
    const errors: ArgsError[] = [];

    if (!isPlainObject(options.introspection) && !(options.schema instanceof GraphQLSchema)) {
      const message =
        '@graphql-box/request-parser expected introspection to be an object or schema to be a GraphQLSchema';

      errors.push(new ArgsError(message));
    }

    if (errors.length > 0) {
      throw new GroupedError('@graphql-box/request-parser argument validation errors.', errors);
    }

    this._maxFieldDepth = options.maxFieldDepth ?? Number.POSITIVE_INFINITY;
    this._maxTypeComplexity = options.maxTypeComplexity ?? Number.POSITIVE_INFINITY;

    try {
      // At this point either introspection or schema has to be defined.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this._schema = options.introspection ? buildClientSchema(options.introspection) : options.schema!;
    } catch (error) {
      const confirmedError = isError(error)
        ? error
        : new ArgsError('@graphql-box/request-parser expected introspection to be converted into a valid schema.');

      throw new GroupedError('@graphql-box/request-parser argument validation errors.', [confirmedError]);
    }

    this._typeComplexityMap = options.typeComplexityMap ?? null;
    this._typeIDKey = options.typeIDKey ?? DEFAULT_TYPE_ID_KEY;
  }

  public updateRequest(request: string, options: RequestOptions, context: RequestContext): UpdateRequestResult {
    const updated = this._updateRequest(request, options, context);
    const errors = validate(this._schema, updated.ast);

    if (errors.length > 0) {
      throw new GroupedError('@graphql-box/request-parser AST validation errors.', errors);
    }

    return updated;
  }

  private _addFieldToNode(node: FieldNode | InlineFragmentNode | FragmentDefinitionNode, key: string): void {
    if (!hasChildFields(node, { name: key })) {
      const mockAST = parse(`{${key}}`);
      const [queryNode] = getOperationDefinitions(mockAST, OperationTypeNode.QUERY);

      if (!queryNode) {
        return;
      }

      const fieldsAndTypeNames = getChildFields(queryNode, { name: key });

      if (!fieldsAndTypeNames) {
        return;
      }

      const [fieldAndTypeName] = fieldsAndTypeNames;

      if (!fieldAndTypeName) {
        return;
      }

      addChildField(node, fieldAndTypeName.fieldNode, this._schema, key);
    }
  }

  private _getFragmentType(node: InlineFragmentNode | FragmentDefinitionNode): GraphQLNamedType | undefined {
    if (!node.typeCondition) {
      return undefined;
    }

    const name = node.typeCondition.name.value;
    return this._schema.getType(name);
  }

  private _updateFieldNode(
    node: FieldNode,
    { ancestors, key }: Ancestors,
    typeInfo: TypeInfo,
    fragmentDefinitions: FragmentDefinitionNodeMap | undefined,
    options: RequestOptions,
    context: VisitorContext,
    inheritedFragmentSpreadDirective: ParsedDirective[] = [],
  ) {
    const typeDef = typeInfo.getFieldDef();
    const type = typeDef ? getType(typeDef) : undefined;
    const parsedFieldDirectives = getFieldDirectives(node, options);
    const [parentNode] = ancestors.slice(-2);

    const parsedParentInlineFragmentDirectives =
      isAncestorAstNode(parentNode) && isKind<InlineFragmentNode>(parentNode, Kind.INLINE_FRAGMENT)
        ? getInlineFragmentDirectives(parentNode, options)
        : [];

    if (
      !toUpdateNode(type, [
        ...parsedFieldDirectives,
        ...parsedParentInlineFragmentDirectives,
        ...inheritedFragmentSpreadDirective,
      ])
    ) {
      return;
    }

    setFragments({ fragmentDefinitions, node, type });

    const directives = parsedFieldDirectives.map(({ args, name }) => `${name}(${JSON.stringify(args)})`);

    const inheritedDirectives = [...parsedParentInlineFragmentDirectives, ...inheritedFragmentSpreadDirective].map(
      ({ args, name }) => `${name}(${JSON.stringify(args)})`,
    );

    const isEntity = isTypeEntity(type, this._typeIDKey);

    const data: MapFieldToTypeData = {
      ancestors,
      directives: {
        inherited: inheritedDirectives,
        own: directives,
      },
      fieldNode: node,
      isEntity,
      isInterface: type instanceof GraphQLInterfaceType,
      isUnion: type instanceof GraphQLUnionType,
      possibleTypes: getPossibleTypeDetails(type, this._schema, this._typeIDKey),
      typeIDKey: this._typeIDKey,
      typeName: 'name' in type ? type.name : '',
    };

    setFragmentAndDirectiveContextProps(node, { ancestors, key }, options, context, [
      ...parsedFieldDirectives,
      ...parsedParentInlineFragmentDirectives,
    ]);

    RequestParser._mapFieldToType(data, options, context);

    if (isEntity) {
      this._addFieldToNode(node, this._typeIDKey);
    }

    if (type instanceof GraphQLInterfaceType || type instanceof GraphQLUnionType) {
      this._addFieldToNode(node, TYPE_NAME_KEY);
    }
  }

  private _updateFragmentDefinitionNode(
    node: FragmentDefinitionNode,
    _typeInfo: TypeInfo,
    fragmentDefinitions: FragmentDefinitionNodeMap | undefined,
  ) {
    const type = this._getFragmentType(node);

    if (!toUpdateNode(type)) {
      return;
    }

    setFragments({ fragmentDefinitions, node, type });
  }

  private _updateInlineFragmentNode(
    node: InlineFragmentNode,
    { ancestors, key }: Ancestors,
    _typeInfo: TypeInfo,
    fragmentDefinitions: FragmentDefinitionNodeMap | undefined,
    options: RequestOptions,
    context: VisitorContext,
  ) {
    const type = this._getFragmentType(node);

    if (!toUpdateNode(type)) {
      return;
    }

    setFragments({ fragmentDefinitions, node, type });
    setFragmentAndDirectiveContextProps(node, { ancestors, key }, options, context);

    if (isTypeEntity(type, this._typeIDKey)) {
      this._addFieldToNode(node, this._typeIDKey);
    }
  }

  private _updateRequest(request: string, options: RequestOptions, context: RequestContext): UpdateRequestResult {
    const updatedRequest = options.fragments ? RequestParser._concatFragments(request, options.fragments) : request;
    const ast = parse(updatedRequest);
    const operationDefinitions = getOperationDefinitions(ast);
    const [operationDefinition] = operationDefinitions;

    if (!operationDefinition || operationDefinitions.length > 1) {
      throw new TypeError(
        `@graphql-box/request-parser expected one operation, but got ${String(operationDefinitions.length)}.`,
      );
    }

    reorderDefinitions(ast);
    const typeInfo = new TypeInfo(this._schema);
    const fragmentDefinitions = getFragmentDefinitions(ast);
    const variableTypes: VariableTypesMap = {};
    const depthChartAncestorsList: Ancestor[][] = [];
    const complexityTypeList: Maybe<GraphQLOutputType>[] = [];

    const visitorContext: VisitorContext = {
      experimentalDeferStreamSupport: context.experimentalDeferStreamSupport,
      fieldTypeMap: context.fieldTypeMap,
      hasDeferOrStream: false,
      operation: operationDefinition.operation,
      operationName: get(operationDefinition, ['name', 'value'], ''),
      persistedFragmentSpreads: [],
    };

    const updatedAST = visit(ast, {
      enter: (node, key, parent, _path, ancestors) => {
        typeInfo.enter(node);
        const [parentNode] = ancestors.slice(-2);

        if (isKind<FieldNode>(node, Kind.FIELD)) {
          const outputType = typeInfo.getType();

          if (outputType) {
            complexityTypeList.push(unwrapOfType(outputType));
          }

          if (isAncestorFragmentDefinition(ancestors)) {
            // Based on above condition, fragmentDefinitionNode must be defined.
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const fragmentDefinitionNode = findAncestorFragmentDefinition(ancestors)!;

            const matches = visitorContext.persistedFragmentSpreads.filter(
              ([name]) => name === fragmentDefinitionNode.name.value,
            );

            for (const match of matches) {
              const fragmentAncestors = [...match[2], ...sliceAncestorsFromFragmentDefinition(ancestors)];

              if (!hasChildFields(node, { fragmentDefinitions })) {
                depthChartAncestorsList.push([...fragmentAncestors, node]);
              }

              this._updateFieldNode(
                node,
                { ancestors: fragmentAncestors, key },
                typeInfo,
                fragmentDefinitions,
                options,
                visitorContext,
                isAncestorAstNode(parentNode) && isKind<FragmentDefinitionNode>(parentNode, Kind.FRAGMENT_DEFINITION)
                  ? match[1]
                  : undefined,
              );
            }
          } else {
            if (!hasChildFields(node, { fragmentDefinitions })) {
              depthChartAncestorsList.push([...ancestors, node]);
            }

            this._updateFieldNode(node, { ancestors, key }, typeInfo, fragmentDefinitions, options, visitorContext);
          }

          return;
        }

        if (isKind<FragmentSpreadNode>(node, Kind.FRAGMENT_SPREAD)) {
          if (isAncestorAstNode(parentNode) && isKind<FragmentDefinitionNode>(parentNode, Kind.FRAGMENT_DEFINITION)) {
            const fragmentDefinitionNode = parentNode;

            const matches = visitorContext.persistedFragmentSpreads.filter(
              ([name]) => name === fragmentDefinitionNode.name.value,
            );

            for (const match of matches) {
              updateFragmentSpreadNode(node, { ancestors: [...match[2]], key: undefined }, options, visitorContext);
            }
          }

          return;
        }

        if (isKind<InlineFragmentNode>(node, Kind.INLINE_FRAGMENT)) {
          this._updateInlineFragmentNode(
            node,
            { ancestors, key },
            typeInfo,
            fragmentDefinitions,
            options,
            visitorContext,
          );

          return;
        }

        if (isKind<FragmentDefinitionNode>(node, Kind.FRAGMENT_DEFINITION)) {
          this._updateFragmentDefinitionNode(node, typeInfo, fragmentDefinitions);
        }

        if (isKind<VariableNode>(node, Kind.VARIABLE)) {
          const variableName = node.name.value;

          if (isAncestorAstNode(parent) && isKind<VariableDefinitionNode>(parent, Kind.VARIABLE_DEFINITION)) {
            const variableDefinitionNode = parent;
            variableTypes[variableName] = this._schema.getType(getVariableDefinitionType(variableDefinitionNode));
            const defaultValue = getVariableDefinitionDefaultValue(variableDefinitionNode);

            if (defaultValue) {
              if (!options.variables) {
                options.variables = {};
              }

              if (!options.variables[variableName]) {
                options.variables[variableName] = defaultValue;
              }
            }

            return;
          }

          return RequestParser._updateVariableNode(node, variableTypes[variableName], options);
        }

        return;
      },
      leave: (node: ASTNode) => {
        typeInfo.leave(node);

        if (isKind<DocumentNode>(node, Kind.DOCUMENT)) {
          return deleteFragmentDefinitions(node, {
            exclude: getPersistedFragmentSpreadNames(visitorContext.persistedFragmentSpreads),
          });
        }

        if (isKind<VariableDefinitionNode>(node, Kind.VARIABLE_DEFINITION)) {
          return null;
        }

        return;
      },
    });

    const maxDepth = getMaxDepthFromChart(makeDepthChart(depthChartAncestorsList));

    if (maxDepth > this._maxFieldDepth) {
      throw new Error(
        `@graphql-box/request-parser >> request field depth of ${String(maxDepth)} exceeded max field depth of ${String(this._maxFieldDepth)}`,
      );
    }

    let typeComplexity: number | null = null;

    if (this._typeComplexityMap) {
      typeComplexity = calcTypeComplexity(complexityTypeList, this._typeComplexityMap);

      if (typeComplexity > this._maxTypeComplexity) {
        throw new Error(
          `@graphql-box/request-parser >> request type complexity of ${String(typeComplexity)} exceeded max type complexity of ${String(this._maxTypeComplexity)}`,
        );
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fieldTypeMap, persistedFragmentSpreads, ...rest } = visitorContext;

    assign(context, {
      ...rest,
      fieldTypeMap: new Map([...fieldTypeMap.entries()].sort()),
      requestComplexity: typeComplexity,
      requestDepth: maxDepth,
    });

    return { ast: updatedAST, request: print(updatedAST) };
  }
}
