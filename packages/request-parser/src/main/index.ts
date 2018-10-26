import { coreDefs } from "@handl/core";
import {
  ASTNode,
  buildClientSchema,
  DocumentNode,
  FieldNode,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLSchema,
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
import { get, isObjectLike, isPlainObject, isString } from "lodash";
import {
  DOCUMENT,
  FIELD,
  INLINE_FRAGMENT,
  METADATA,
  OPERATION_DEFINITION,
  QUERY,
  VARIABLE,
} from "../consts";
import * as defs from "../defs";
import {
  addChildField,
  deleteFragmentDefinitions,
  deleteVariableDefinitions,
  getAlias,
  getArguments,
  getChildFields,
  getFragmentDefinitions,
  getKind,
  getName,
  getOperationDefinitions,
  getType,
  hasChildFields,
  hasFragmentDefinitions,
  hasFragmentSpreads,
  hasVariableDefinitions,
  setFragmentDefinitions,
} from "../parsing";
import { getDirectives } from "../parsing/directives";

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
    { operation, operationName }: coreDefs.RequestContext,
  ): void {
    operation = operationDefinitions[0].operation;
    operationName = get(operationDefinitions[0], ["name", "value"], "");
  }

  private static _concatFragments(query: string, fragments: string[]): string {
    return [query, ...fragments].join("\n\n");
  }

  private static _deleteFragmentDefinitions(
    node: DocumentNode,
    { fragments }: coreDefs.RequestOptions,
  ): DocumentNode | undefined {
    if (!fragments || !hasFragmentDefinitions(node)) return undefined;

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
    if (!fragments || !hasFragmentDefinitions(node)) return undefined;
    return getFragmentDefinitions(node);
  }

  private static _parseArrayToInputString(values: any[]): string {
    let inputString = "[";

    values.forEach((value, index, arr) => {
      if (!isPlainObject(value)) {
        inputString += isString(value) ? `"${value}"` : `${value}`;
      } else {
        inputString += RequestParser._parseToInputString(value);
      }

      if (index < arr.length - 1) { inputString += ","; }
    });

    inputString += "]";
    return inputString;
  }

  private static _parseObjectToInputString(obj: coreDefs.PlainObjectMap): string {
    let inputString = "{";

    Object.keys(obj).forEach((key, index, arr) => {
      inputString += `${key}:`;

      if (!isPlainObject(obj[key])) {
        inputString += isString(obj[key]) ? `"${obj[key]}"` : `${obj[key]}`;
      } else {
        inputString += RequestParser._parseToInputString(obj[key]);
      }

      if (index < arr.length - 1) { inputString += ","; }
    });

    inputString += "}";
    return inputString;
  }

  private static _parseToInputString(value: coreDefs.PlainObjectMap | any[]): string {
    if (isPlainObject(value)) return RequestParser._parseObjectToInputString(value as coreDefs.PlainObjectMap);

    return RequestParser._parseArrayToInputString(value as any[]);
  }

  private static _updateVariableNode(node: VariableNode, { variables }: coreDefs.RequestOptions): ValueNode {
    if (!variables) return parseValue(`${null}`);

    const name = getName(node) as string;
    const value = variables[name];
    if (!value) return parseValue(`${null}`);

    if (isObjectLike(value)) return parseValue(RequestParser._parseToInputString(value));

    return parseValue(isString(value) ? `"${value}"` : `${value}`);
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

      if (fragmentDefinitions && hasFragmentSpreads(fieldNode)) {
        setFragmentDefinitions(fragmentDefinitions, fieldNode);
      }
    }

    if (!(type instanceof GraphQLObjectType) && !(type instanceof GraphQLInterfaceType)) return undefined;
    const objectOrInterfaceType = type;
    const fields = objectOrInterfaceType.getFields();

    if (kind === FIELD) {
      const fieldNode = node as FieldNode;

      const data: defs.MapFieldToTypeData = {
        ancestors,
        fieldNode,
        isEntity: !!fields[this._typeIDKey],
        typeIDKey: this._typeIDKey,
        typeName: objectOrInterfaceType.name,
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

    if (fields._metadata && !hasChildFields(node, METADATA)) {
      const mockAST = parse(`{ _metadata { cacheControl } }`);
      const queryNode = getOperationDefinitions(mockAST, QUERY)[0];
      const field = getChildFields(queryNode, METADATA) as FieldNode;
      addChildField(node, field, this._schema, this._typeIDKey);
    }

    return undefined;
  }

  private async _updateRequest(
    request: string,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<defs.UpdateRequestResult> {
    const _this = this;
    const typeInfo = new TypeInfo(this._schema);
    let fragmentDefinitions: defs.FragmentDefinitionNodeMap | undefined;

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
          return RequestParser._updateVariableNode(node as VariableNode, options);
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
  }
}

export default function init(userOptions: defs.UserOptions): defs.RequestParserInit {
  if (!isPlainObject(userOptions)) {
    throw new TypeError("@handl/request-parser expected userOptions to be a plain object.");
  }

  return (clientOptions: defs.ClientOptions) => RequestParser.init({ ...clientOptions, ...userOptions });
}
