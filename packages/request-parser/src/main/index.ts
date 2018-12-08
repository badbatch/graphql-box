import { coreDefs } from "@handl/core";
import {
  ASTNode,
  buildClientSchema,
  DocumentNode,
  FieldNode,
  GraphQLEnumType,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLSchema,
  GraphQLUnionType,
  InlineFragmentNode,
  OperationDefinitionNode,
  parse,
  parseValue,
  print,
  TypeInfo,
  validate,
  ValueNode,
  VariableNode,
  visit,
} from "graphql";
import Maybe from "graphql/tsutils/Maybe";
import { get, isObjectLike, isPlainObject, isString } from "lodash";
import {
  DOCUMENT,
  FIELD,
  INLINE_FRAGMENT,
  NAME,
  OPERATION_DEFINITION,
  QUERY,
  VALUE,
  VARIABLE,
  VARIABLE_DEFINITION,
} from "../consts";
import * as defs from "../defs";
import {
  addChildField,
  deleteFragmentDefinitions,
  deleteVariableDefinitions,
  getAlias,
  getArguments,
  getChildFields,
  getDirectives,
  getFragmentDefinitions,
  getKind,
  getName,
  getOperationDefinitions,
  getType,
  getVariableDefinitionType,
  hasChildFields,
  hasFragmentDefinitions,
  hasFragmentSpreads,
  hasInlineFragments,
  hasVariableDefinitions,
  setFragmentDefinitions,
  setInlineFragments,
} from "../parsing";

export class RequestParser implements defs.RequestParser {
  public static async init(options: defs.InitOptions): Promise<RequestParser> {
    const errors: TypeError[] = [];

    if (!isPlainObject(options.introspection)) {
       errors.push(new TypeError("@handl/request-parser expected introspection to be a plain object."));
    }

    if (errors.length) return Promise.reject(errors);

    try {
      const constructorOptions: defs.ConstructorOptions = {
        schema: buildClientSchema(options.introspection),
        typeIDKey: options.typeIDKey,
      };

      return new RequestParser(constructorOptions);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private static _addOperationToContext(
    operationDefinitions: OperationDefinitionNode[],
    context: coreDefs.RequestContext,
  ): void {
    context.operation = operationDefinitions[0].operation;
    context.operationName = get(operationDefinitions[0], [NAME, VALUE], "");
  }

  private static _concatFragments(query: string, fragments: string[]): string {
    return [query, ...fragments].join("\n\n");
  }

  private static _deleteFragmentDefinitions(
    node: DocumentNode,
    { fragments }: coreDefs.RequestOptions,
  ): DocumentNode | undefined {
    if (!fragments && !hasFragmentDefinitions(node)) return undefined;

    return deleteFragmentDefinitions(node);
  }

  private static _deleteVariableDefinitions(
    node: OperationDefinitionNode,
    { variables }: coreDefs.RequestOptions,
  ): OperationDefinitionNode | undefined {
    if (!variables || !hasVariableDefinitions(node)) return undefined;

    return deleteVariableDefinitions(node);
  }

  private static _mapFieldToType(
    data: defs.MapFieldToTypeData,
    { variables }: coreDefs.RequestOptions,
    { fieldTypeMap }: coreDefs.RequestContext,
  ): void {
    const { ancestors, fieldNode, isEntity, typeIDKey, typeName } = data;
    const ancestorFieldPath: string[] = [];

    ancestors.forEach((ancestor) => {
      if (isPlainObject(ancestor) && getKind(ancestor as ASTNode) === FIELD) {
        const ancestorFieldNode = ancestor as FieldNode;
        ancestorFieldPath.push(getAlias(ancestorFieldNode) || getName(ancestorFieldNode) as string);
      }
    });

    const fieldName = getAlias(fieldNode) || getName(fieldNode) as string;
    ancestorFieldPath.push(fieldName);
    const fieldPath = ancestorFieldPath.join(".");
    const argumentsObjectMap = getArguments(fieldNode);
    const directives = getDirectives(fieldNode);
    let typeIDValue: string | undefined;

    if (argumentsObjectMap) {
      if (argumentsObjectMap[typeIDKey]) {
        typeIDValue = argumentsObjectMap[typeIDKey];
      } else if (variables && variables[typeIDKey]) {
        typeIDValue = variables[typeIDKey];
      }
    }

    fieldTypeMap.set(fieldPath, {
      hasArguments: !!argumentsObjectMap,
      hasDirectives: !!directives,
      isEntity,
      typeIDValue,
      typeName,
    });
  }

  private static _getFragmentDefinitions(
    node: DocumentNode,
    { fragments }: coreDefs.RequestOptions,
  ): defs.FragmentDefinitionNodeMap | undefined {
    if (!fragments && !hasFragmentDefinitions(node)) return undefined;
    return getFragmentDefinitions(node);
  }

  private static _parseArrayToInputString(values: any[], variableType: Maybe<GraphQLNamedType>): string {
    let inputString = "[";

    values.forEach((value, index, arr) => {
      if (!isPlainObject(value)) {
        const sanitizedValue = isString(value) && !(variableType instanceof GraphQLEnumType)
          ? `"${value}"` : `${value}`;

        inputString += sanitizedValue;
      } else {
        inputString += RequestParser._parseToInputString(value, variableType);
      }

      if (index < arr.length - 1) { inputString += ","; }
    });

    inputString += "]";
    return inputString;
  }

  private static _parseObjectToInputString(
    obj: coreDefs.PlainObjectMap,
    variableType: Maybe<GraphQLNamedType>,
  ): string {
    let inputString = "{";

    Object.keys(obj).forEach((key, index, arr) => {
      inputString += `${key}:`;

      if (!isPlainObject(obj[key])) {
        inputString += isString(obj[key]) ? `"${obj[key]}"` : `${obj[key]}`;
      } else {
        inputString += RequestParser._parseToInputString(obj[key], variableType);
      }

      if (index < arr.length - 1) { inputString += ","; }
    });

    inputString += "}";
    return inputString;
  }

  private static _parseToInputString(
    value: coreDefs.PlainObjectMap | any[],
    variableType: Maybe<GraphQLNamedType>,
  ): string {
    if (isPlainObject(value)) {
      return RequestParser._parseObjectToInputString(value as coreDefs.PlainObjectMap, variableType);
    }

    return RequestParser._parseArrayToInputString(value as any[], variableType);
  }

  private static _updateVariableNode(
    node: VariableNode,
    variableType: Maybe<GraphQLNamedType>,
    { variables }: coreDefs.RequestOptions,
  ): ValueNode {
    if (!variables) return parseValue(`${null}`);

    const name = getName(node) as string;
    const value = variables[name];
    if (!value) return parseValue(`${null}`);

    if (isObjectLike(value)) return parseValue(RequestParser._parseToInputString(value, variableType));

    const sanitizedValue = isString(value) && !(variableType instanceof GraphQLEnumType) ? `"${value}"` : `${value}`;
    return parseValue(sanitizedValue);
  }

  private _schema: GraphQLSchema;
  private _typeIDKey: string;

  constructor(options: defs.ConstructorOptions) {
    this._schema = options.schema;
    this._typeIDKey = options.typeIDKey;
  }

  public async updateRequest(
    request: string,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<defs.UpdateRequestResult> {
    try {
      const updated = await this._updateRequest(request, options, context);
      const errors = validate(this._schema, updated.ast);
      if (errors.length) return Promise.reject(errors);

      return updated;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _getFieldOrInlineFragmentType(
    kind: "Field" | "InlineFragment",
    node: FieldNode | InlineFragmentNode,
    typeInfo: TypeInfo,
  ): GraphQLOutputType | GraphQLNamedType | undefined {
    if (kind === FIELD) {
      const typeDef = typeInfo.getFieldDef();
      return typeDef ? getType(typeDef) : undefined;
    } else {
      const inlineFragmentNode = node as InlineFragmentNode;
      if (!inlineFragmentNode.typeCondition) return undefined;

      const name = getName(inlineFragmentNode.typeCondition) as string;
      const parentType = typeInfo.getParentType();
      if (!parentType || name === parentType.name) return undefined;

      return this._schema.getType(name) || undefined;
    }
  }

  private _updateFieldOrInlineFragmentNode(
    node: FieldNode | InlineFragmentNode,
    ancestors: ReadonlyArray<any>,
    kind: "Field" | "InlineFragment",
    typeInfo: TypeInfo,
    fragmentDefinitions: defs.FragmentDefinitionNodeMap | undefined,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ) {
    const type = this._getFieldOrInlineFragmentType(kind, node, typeInfo);
    if (!type) return undefined;

    if (kind === FIELD) {
      const fieldNode = node as FieldNode;

      if (!(type instanceof GraphQLUnionType) && hasInlineFragments(fieldNode)) {
        setInlineFragments(fieldNode);
      }

      if (fragmentDefinitions && hasFragmentSpreads(fieldNode)) {
        setFragmentDefinitions(fragmentDefinitions, fieldNode);
      }
    }

    if (!(type instanceof GraphQLObjectType) && !(type instanceof GraphQLInterfaceType)) return undefined;
    const fields = type.getFields();

    if (kind === FIELD) {
      const fieldNode = node as FieldNode;

      const data: defs.MapFieldToTypeData = {
        ancestors,
        fieldNode,
        isEntity: !!fields[this._typeIDKey],
        typeIDKey: this._typeIDKey,
        typeName: type.name,
      };

      RequestParser._mapFieldToType(data, options, context);
    }

    if (fields[this._typeIDKey]) {
      if (!hasChildFields(node, this._typeIDKey)) {
        const mockAST = parse(`{${this._typeIDKey}}`);
        const queryNode = getOperationDefinitions(mockAST, QUERY)[0];
        const field = getChildFields(queryNode, this._typeIDKey) as FieldNode;
        addChildField(node, field, this._schema, this._typeIDKey);
      }
    }

    return undefined;
  }

  private async _updateRequest(
    request: string,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<defs.UpdateRequestResult> {
    try {
      const _this = this;
      const typeInfo = new TypeInfo(this._schema);
      let fragmentDefinitions: defs.FragmentDefinitionNodeMap | undefined;
      const variableTypes: defs.VariableTypesMap = {};

      let updatedRequest;

      if (options.fragments) {
        updatedRequest = RequestParser._concatFragments(request, options.fragments);
      } else {
        updatedRequest = request;
      }

      const ast = parse(updatedRequest);
      const operationDefinitions = getOperationDefinitions(ast);

      if (operationDefinitions.length > 1) {
        return Promise.reject(new TypeError("@handl/request-parser expected one operation, but got multiple."));
      }

      RequestParser._addOperationToContext(operationDefinitions, context);

      const updatedAST = visit(ast, {
        enter(
          node: ASTNode,
          key: string | number | undefined,
          parent: any | ReadonlyArray<any> | undefined,
          path: ReadonlyArray<string | number>,
          ancestors: ReadonlyArray<any>,
        ): ValueNode | undefined {
          typeInfo.enter(node);
          const kind = getKind(node);

          if (kind === DOCUMENT) {
            fragmentDefinitions = RequestParser._getFragmentDefinitions(node as DocumentNode, options);
            return undefined;
          }

          if (kind === FIELD || kind === INLINE_FRAGMENT) {
            return _this._updateFieldOrInlineFragmentNode(
              node as FieldNode | InlineFragmentNode,
              ancestors,
              kind,
              typeInfo,
              fragmentDefinitions,
              options,
              context,
            );
          }

          if (kind === VARIABLE) {
            const variableName = getName(node) as string;

            if (getKind(parent) === VARIABLE_DEFINITION) {
              variableTypes[variableName] = _this._schema.getType(getVariableDefinitionType(parent));
            }

            return RequestParser._updateVariableNode(
              node as VariableNode,
              variableTypes[variableName],
              options,
            );
          }

          return undefined;
        },
        leave(node: ASTNode): any {
          typeInfo.leave(node);
          const kind = getKind(node);

          if (kind === DOCUMENT) {
            return RequestParser._deleteFragmentDefinitions(node as DocumentNode, options);
          }

          if (kind === OPERATION_DEFINITION) {
            return RequestParser._deleteVariableDefinitions(node as OperationDefinitionNode, options);
          }
        },
      });

      return { ast: updatedAST, request: print(updatedAST) };
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default function init(userOptions: defs.UserOptions): defs.RequestParserInit {
  if (!isPlainObject(userOptions)) {
    throw new TypeError("@handl/request-parser expected userOptions to be a plain object.");
  }

  return (clientOptions: defs.ClientOptions) => RequestParser.init({ ...clientOptions, ...userOptions });
}
