import { PlainObjectMap, PossibleType, RequestContext, RequestOptions, TYPE_NAME_KEY } from "@handl/core";
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
} from "@handl/helpers";
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
import {
  ClientOptions,
  ConstructorOptions,
  FragmentDefinitionNodeMap,
  InitOptions,
  MapFieldToTypeData,
  RequestParserDef,
  RequestParserInit,
  UpdateRequestResult,
  UserOptions,
  VariableTypesMap,
} from "../defs";

export class RequestParser implements RequestParserDef {
  public static async init(options: InitOptions): Promise<RequestParser> {
    const errors: TypeError[] = [];

    if (!isPlainObject(options.introspection)) {
       errors.push(new TypeError("@handl/request-parser expected introspection to be a plain object."));
    }

    if (errors.length) return Promise.reject(errors);

    try {
      const constructorOptions: ConstructorOptions = {
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
    context: RequestContext,
  ): void {
    context.operation = operationDefinitions[0].operation;
    context.operationName = get(operationDefinitions[0], [NAME, VALUE], "");
  }

  private static _concatFragments(query: string, fragments: string[]): string {
    return [query, ...fragments].join("\n\n");
  }

  private static _deleteFragmentDefinitions(
    node: DocumentNode,
    { fragments }: RequestOptions,
  ): DocumentNode | undefined {
    if (!fragments && !hasFragmentDefinitions(node)) return undefined;

    return deleteFragmentDefinitions(node);
  }

  private static _deleteVariableDefinitions(
    node: OperationDefinitionNode,
    { variables }: RequestOptions,
  ): OperationDefinitionNode | undefined {
    if (!variables || !hasVariableDefinitions(node)) return undefined;

    return deleteVariableDefinitions(node);
  }

  private static _mapFieldToType(
    data: MapFieldToTypeData,
    { variables }: RequestOptions,
    { fieldTypeMap, operation }: RequestContext,
  ): void {
    const { ancestors, fieldNode, isEntity, isInterface, isUnion, possibleTypes, typeIDKey, typeName } = data;
    const ancestorRequestFieldPath: string[] = [operation];

    ancestors.forEach((ancestor) => {
      if (isPlainObject(ancestor) && getKind(ancestor as ASTNode) === FIELD) {
        const ancestorFieldNode = ancestor as FieldNode;
        ancestorRequestFieldPath.push(getAlias(ancestorFieldNode) || getName(ancestorFieldNode) as string);
      }
    });

    const fieldName = getAlias(fieldNode) || getName(fieldNode) as string;
    ancestorRequestFieldPath.push(fieldName);
    const requestfieldPath = ancestorRequestFieldPath.join(".");
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

    fieldTypeMap.set(requestfieldPath, {
      hasArguments: !!argumentsObjectMap,
      hasDirectives: !!directives,
      isEntity,
      isInterface,
      isUnion,
      possibleTypes,
      typeIDValue,
      typeName,
    });
  }

  private static _getFragmentDefinitions(
    node: DocumentNode,
    { fragments }: RequestOptions,
  ): FragmentDefinitionNodeMap | undefined {
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
    obj: PlainObjectMap,
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
    value: PlainObjectMap | any[],
    variableType: Maybe<GraphQLNamedType>,
  ): string {
    if (isPlainObject(value)) {
      return RequestParser._parseObjectToInputString(value as PlainObjectMap, variableType);
    }

    return RequestParser._parseArrayToInputString(value as any[], variableType);
  }

  private static _updateVariableNode(
    node: VariableNode,
    variableType: Maybe<GraphQLNamedType>,
    { variables }: RequestOptions,
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

  constructor(options: ConstructorOptions) {
    const { schema, typeIDKey } = options;
    this._schema = schema;
    this._typeIDKey = typeIDKey;
  }

  public async updateRequest(
    request: string,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<UpdateRequestResult> {
    try {
      const updated = await this._updateRequest(request, options, context);

      const errors = validate(this._schema, updated.ast);
      if (errors.length) return Promise.reject(errors);

      return updated;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _addFieldToNode(
    node: FieldNode | InlineFragmentNode,
    key: string,
  ): void {
      if (!hasChildFields(node, key)) {
        const mockAST = parse(`{${key}}`);
        const queryNode = getOperationDefinitions(mockAST, QUERY)[0];
        const fieldsAndTypeNames = getChildFields(queryNode, key);
        if (!fieldsAndTypeNames) return;

        const { fieldNode } = fieldsAndTypeNames[0];
        addChildField(node, fieldNode, this._schema, key);
      }
    }

  private _getInlineFragmentType(
    node: InlineFragmentNode,
    typeInfo: TypeInfo,
  ): GraphQLOutputType | GraphQLNamedType | undefined {
    if (!node.typeCondition) return undefined;

    const name = getName(node.typeCondition) as string;
    const parentType = typeInfo.getParentType();
    if (!parentType || name === parentType.name) return undefined;

    return this._schema.getType(name) || undefined;
  }

  private _updateFieldNode(
    node: FieldNode,
    ancestors: ReadonlyArray<any>,
    typeInfo: TypeInfo,
    fragmentDefinitions: FragmentDefinitionNodeMap | undefined,
    options: RequestOptions,
    context: RequestContext,
  ): undefined {
    const typeDef = typeInfo.getFieldDef();
    const type = typeDef ? getType(typeDef) : undefined;

    if (
      !type
      || (!(type instanceof GraphQLObjectType)
      && !(type instanceof GraphQLInterfaceType)
      && !(type instanceof GraphQLUnionType))
    ) return undefined;

    if (
      !(type instanceof GraphQLInterfaceType)
      && !(type instanceof GraphQLUnionType)
      && hasInlineFragments(node)
    ) {
      setInlineFragments(node);
    }

    if (fragmentDefinitions && hasFragmentSpreads(node)) {
      setFragmentDefinitions(fragmentDefinitions, node);
    }

    const possibleTypeDetails: PossibleType[] = [];

    if (type instanceof GraphQLInterfaceType || type instanceof GraphQLUnionType) {
      const possibleTypes = this._schema.getPossibleTypes(type);

      possibleTypeDetails.push(...possibleTypes.map((possibleType) => {
        const fields = possibleType.getFields();

        return {
          isEntity: !!fields[this._typeIDKey],
          typeName: possibleType.name,
        };
      }));
    }

    let isEntity = false;

    if ("getFields" in type) {
      const fields = type.getFields();
      isEntity = !!fields[this._typeIDKey];
    }

    const data: MapFieldToTypeData = {
      ancestors,
      fieldNode: node,
      isEntity,
      isInterface: type instanceof GraphQLInterfaceType,
      isUnion: type instanceof GraphQLUnionType,
      possibleTypes: possibleTypeDetails,
      typeIDKey: this._typeIDKey,
      typeName: type.name,
    };

    RequestParser._mapFieldToType(data, options, context);

    if (isEntity) {
      this._addFieldToNode(node, this._typeIDKey);
    }

    if (type instanceof GraphQLInterfaceType || type instanceof GraphQLUnionType) {
      this._addFieldToNode(node, TYPE_NAME_KEY);
    }

    return undefined;
  }

  private _updateInlineFragmentNode(
    node: InlineFragmentNode,
    ancestors: ReadonlyArray<any>,
    typeInfo: TypeInfo,
    options: RequestOptions,
    context: RequestContext,
  ): undefined {
    const type = this._getInlineFragmentType(node, typeInfo);

    if (
      !type
      || (!(type instanceof GraphQLObjectType)
      && !(type instanceof GraphQLInterfaceType)
      && !(type instanceof GraphQLUnionType))
    ) return undefined;

    let isEntity = false;

    if ("getFields" in type) {
      const fields = type.getFields();
      isEntity = !!fields[this._typeIDKey];
    }

    if (isEntity) {
      this._addFieldToNode(node, this._typeIDKey);
    }

    return undefined;
  }

  private async _updateRequest(
    request: string,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<UpdateRequestResult> {
    const updatedRequest = options.fragments ? RequestParser._concatFragments(request, options.fragments) : request;
    const ast = parse(updatedRequest);
    const operationDefinitions = getOperationDefinitions(ast);

    if (operationDefinitions.length > 1) {
      return Promise.reject(new TypeError("@handl/request-parser expected one operation, but got multiple."));
    }

    RequestParser._addOperationToContext(operationDefinitions, context);

    const _this = this;
    const typeInfo = new TypeInfo(this._schema);
    let fragmentDefinitions: FragmentDefinitionNodeMap | undefined;
    const variableTypes: VariableTypesMap = {};

    try {
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

          if (kind === FIELD) {
            return _this._updateFieldNode(
              node as FieldNode,
              ancestors,
              typeInfo,
              fragmentDefinitions,
              options,
              context,
            );
          }

          if (kind === INLINE_FRAGMENT) {
            return _this._updateInlineFragmentNode(
              node as InlineFragmentNode,
              ancestors,
              typeInfo,
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

export default function init(userOptions: UserOptions): RequestParserInit {
  if (!isPlainObject(userOptions)) {
    throw new TypeError("@handl/request-parser expected userOptions to be a plain object.");
  }

  return (clientOptions: ClientOptions) => RequestParser.init({ ...clientOptions, ...userOptions });
}
