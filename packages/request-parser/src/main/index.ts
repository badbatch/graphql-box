import {
  Maybe,
  PlainObjectMap,
  QUERY,
  RequestContext,
  RequestOptions,
  TYPE_NAME_KEY,
  VariableTypesMap,
} from "@graphql-box/core";
import {
  DOCUMENT,
  FIELD,
  FRAGMENT_DEFINITION,
  FragmentDefinitionNodeMap,
  INLINE_FRAGMENT,
  NAME,
  ParsedDirective,
  VALUE,
  VARIABLE,
  VARIABLE_DEFINITION,
  addChildField,
  deleteFragmentDefinitions,
  getAlias,
  getArguments,
  getChildFields,
  getFieldDirectives,
  getFragmentDefinitions,
  getInlineFragmentDirectives,
  getKind,
  getName,
  getOperationDefinitions,
  getType,
  getVariableDefinitionDefaultValue,
  getVariableDefinitionType,
  hasChildFields,
  isKind,
  setFragments,
} from "@graphql-box/helpers";
import {
  ASTNode,
  DefinitionNode,
  DocumentNode,
  FieldNode,
  FragmentDefinitionNode,
  GraphQLEnumType,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLSchema,
  GraphQLUnionType,
  InlineFragmentNode,
  NamedTypeNode,
  TypeInfo,
  ValueNode,
  VariableDefinitionNode,
  VariableNode,
  buildClientSchema,
  parse,
  parseValue,
  print,
  validate,
  visit,
} from "graphql";
import { assign, get, isEmpty, isObjectLike, isPlainObject, isString, keys } from "lodash";
import {
  Ancestors,
  ClientOptions,
  ConstructorOptions,
  InitOptions,
  MapFieldToTypeData,
  RequestParserDef,
  RequestParserInit,
  UpdateRequestResult,
  UserOptions,
  VisitorContext,
} from "../defs";
import getPersistedFragmentSpreadNames from "../helpers/getPersistedFragmentSpreadNames";
import getPossibleTypeDetails from "../helpers/getPossibleTypeDetails";
import isTypeEntity from "../helpers/isTypeEntity";
import reorderDefinitions from "../helpers/reorderDefinitions";
import setFragmentAndDirectiveContextProps from "../helpers/setFragmentAndDirectiveContextProps";
import toUpdateNode from "../helpers/toUpdateNode";

export class RequestParser implements RequestParserDef {
  public static async init(options: InitOptions): Promise<RequestParser> {
    const { introspection, schema, typeIDKey } = options;
    const errors: TypeError[] = [];

    if (!isPlainObject(introspection) && !(schema instanceof GraphQLSchema)) {
      const msg = "@graphql-box/request-parser expected introspection to be an object or schema to be a GraphQLSchema";
      errors.push(new TypeError(msg));
    }

    if (errors.length) return Promise.reject(errors);

    try {
      const constructorOptions: ConstructorOptions = {
        schema: introspection ? buildClientSchema(introspection) : (schema as GraphQLSchema),
        typeIDKey,
      };

      return new RequestParser(constructorOptions);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private static _concatFragments(query: string, fragments: string[]): string {
    return [query, ...fragments].join("\n\n");
  }

  private static _mapFieldToType(
    data: MapFieldToTypeData,
    { variables }: RequestOptions,
    context: VisitorContext,
  ): void {
    const {
      ancestors,
      fieldNode,
      directives,
      isEntity,
      isInterface,
      isUnion,
      possibleTypes,
      typeIDKey,
      typeName,
    } = data;

    const { fieldTypeMap, operation } = context;
    const ancestorRequestFieldPath: string[] = [operation];

    ancestors.forEach(ancestor => {
      if (isPlainObject(ancestor) && getKind(ancestor as ASTNode) === FIELD) {
        const ancestorFieldNode = ancestor as FieldNode;
        ancestorRequestFieldPath.push(getAlias(ancestorFieldNode) || (getName(ancestorFieldNode) as string));
      }
    });

    const fieldName = getAlias(fieldNode) || (getName(fieldNode) as string);
    ancestorRequestFieldPath.push(fieldName);
    const requestfieldPath = ancestorRequestFieldPath.join(".");
    const argumentsObjectMap = getArguments(fieldNode);
    let typeIDValue: string | undefined;

    if (argumentsObjectMap) {
      if (argumentsObjectMap[typeIDKey]) {
        typeIDValue = argumentsObjectMap[typeIDKey];
      } else if (variables && variables[typeIDKey]) {
        typeIDValue = variables[typeIDKey];
      }
    }

    fieldTypeMap.set(requestfieldPath, {
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

  private static _parseArrayToInputString(values: any[], variableType: Maybe<GraphQLNamedType>): string {
    let inputString = "[";

    values.forEach((value, index, arr) => {
      if (!isPlainObject(value)) {
        const sanitizedValue =
          isString(value) && !(variableType instanceof GraphQLEnumType) ? `"${value}"` : `${value}`;

        inputString += sanitizedValue;
      } else {
        inputString += RequestParser._parseToInputString(value, variableType);
      }

      if (index < arr.length - 1) {
        inputString += ",";
      }
    });

    inputString += "]";
    return inputString;
  }

  private static _parseObjectToInputString(obj: PlainObjectMap, variableType: Maybe<GraphQLNamedType>): string {
    let inputString = "{";

    keys(obj).forEach((key, index, arr) => {
      inputString += `${key}:`;

      if (!isPlainObject(obj[key])) {
        inputString += isString(obj[key]) ? `"${obj[key]}"` : `${obj[key]}`;
      } else {
        inputString += RequestParser._parseToInputString(obj[key], variableType);
      }

      if (index < arr.length - 1) {
        inputString += ",";
      }
    });

    inputString += "}";
    return inputString;
  }

  private static _parseToInputString(value: PlainObjectMap | any[], variableType: Maybe<GraphQLNamedType>): string {
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
    if (!variables) {
      return parseValue(`${null}`);
    }

    const name = getName(node) as string;
    const value = variables[name];

    if (!value) {
      return parseValue(`${null}`);
    }

    if (isObjectLike(value)) {
      return parseValue(RequestParser._parseToInputString(value, variableType));
    }

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

      if (errors.length) {
        return Promise.reject(errors);
      }

      return updated;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _addFieldToNode(node: FieldNode | InlineFragmentNode | FragmentDefinitionNode, key: string): void {
    if (!hasChildFields(node, { name: key })) {
      const mockAST = parse(`{${key}}`);
      const queryNode = getOperationDefinitions(mockAST, QUERY)[0];
      const fieldsAndTypeNames = getChildFields(queryNode, { name: key });
      if (!fieldsAndTypeNames) return;

      const { fieldNode } = fieldsAndTypeNames[0];
      addChildField(node, fieldNode, this._schema, key);
    }
  }

  private _getFragmentType(node: InlineFragmentNode | FragmentDefinitionNode): GraphQLNamedType | undefined {
    if (!node.typeCondition) {
      return undefined;
    }

    const name = getName(node.typeCondition) as NamedTypeNode["name"]["value"];
    return this._schema.getType(name) || undefined;
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

    const parsedParentInlineFragmentDirectives = isKind<InlineFragmentNode>(parentNode, INLINE_FRAGMENT)
      ? getInlineFragmentDirectives(parentNode, options)
      : [];

    if (
      !toUpdateNode(type, [
        ...parsedFieldDirectives,
        ...parsedParentInlineFragmentDirectives,
        ...inheritedFragmentSpreadDirective,
      ])
    ) {
      return undefined;
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
      typeName: "name" in type ? type.name : "",
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

    return undefined;
  }

  private _updateFragmentDefinitionNode(
    node: FragmentDefinitionNode,
    { ancestors, key }: Ancestors,
    _typeInfo: TypeInfo,
    fragmentDefinitions: FragmentDefinitionNodeMap | undefined,
    options: RequestOptions,
    context: VisitorContext,
  ) {
    const type = this._getFragmentType(node);

    if (!toUpdateNode(type)) {
      return undefined;
    }

    setFragments({ fragmentDefinitions, node, type });
    setFragmentAndDirectiveContextProps(node, { ancestors, key }, options, context);
    return undefined;
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
      return undefined;
    }

    setFragments({ fragmentDefinitions, node, type });
    setFragmentAndDirectiveContextProps(node, { ancestors, key }, options, context);

    if (isTypeEntity(type, this._typeIDKey)) {
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

    if (!operationDefinitions.length || operationDefinitions.length > 1) {
      return Promise.reject(
        new TypeError(`@graphql-box/request-parser expected one operation, but got ${operationDefinitions.length}.`),
      );
    }

    reorderDefinitions(ast.definitions as DefinitionNode[]);

    const _this = this;
    const typeInfo = new TypeInfo(this._schema);
    const fragmentDefinitions = getFragmentDefinitions(ast);
    const variableTypes: VariableTypesMap = {};

    const visitorContext: VisitorContext = {
      fieldTypeMap: context.fieldTypeMap,
      hasDeferOrStream: false,
      operation: operationDefinitions[0].operation,
      operationName: get(operationDefinitions[0], [NAME, VALUE], ""),
      persistedFragmentSpreads: [],
    };

    try {
      const updatedAST = visit(ast, {
        enter(
          node: ASTNode,
          key: string | number | undefined,
          parent: any | ReadonlyArray<any> | undefined,
          _path: ReadonlyArray<string | number>,
          ancestors: ReadonlyArray<any>,
        ) {
          typeInfo.enter(node);

          if (isKind<FieldNode>(node, FIELD)) {
            const [parentNode] = ancestors.slice(-2);

            if (isKind<FragmentDefinitionNode>(parentNode, FRAGMENT_DEFINITION)) {
              const matches = visitorContext.persistedFragmentSpreads.filter(
                ([name]) => name === (getName(parentNode) as FragmentDefinitionNode["name"]["value"]),
              );

              matches.forEach(match => {
                _this._updateFieldNode(
                  node,
                  { ancestors: [...match[2], ancestors[ancestors.length - 1]], key },
                  typeInfo,
                  fragmentDefinitions,
                  options,
                  visitorContext,
                  match[1],
                );
              });
            } else {
              _this._updateFieldNode(node, { ancestors, key }, typeInfo, fragmentDefinitions, options, visitorContext);
            }

            return undefined;
          }

          if (isKind<InlineFragmentNode>(node, INLINE_FRAGMENT)) {
            _this._updateInlineFragmentNode(
              node,
              { ancestors, key },
              typeInfo,
              fragmentDefinitions,
              options,
              visitorContext,
            );
            return undefined;
          }

          if (isKind<FragmentDefinitionNode>(node, FRAGMENT_DEFINITION)) {
            _this._updateFragmentDefinitionNode(
              node,
              { ancestors, key },
              typeInfo,
              fragmentDefinitions,
              options,
              visitorContext,
            );
          }

          if (isKind<VariableNode>(node, VARIABLE)) {
            const variableName = getName(node) as VariableNode["name"]["value"];

            if (isKind<VariableDefinitionNode>(parent, VARIABLE_DEFINITION)) {
              variableTypes[variableName] = _this._schema.getType(getVariableDefinitionType(parent));
              const defaultValue = getVariableDefinitionDefaultValue(parent);

              if (defaultValue) {
                if (!options.variables) {
                  options.variables = {};
                }

                if (!options.variables[variableName]) {
                  options.variables[variableName] = defaultValue;
                }
              }

              return undefined;
            }

            return RequestParser._updateVariableNode(node, variableTypes[variableName], options);
          }

          return undefined;
        },
        leave(node: ASTNode) {
          typeInfo.leave(node);

          if (isKind<DocumentNode>(node, DOCUMENT)) {
            return deleteFragmentDefinitions(node, {
              exclude: getPersistedFragmentSpreadNames(visitorContext.persistedFragmentSpreads),
            });
          }

          if (isKind<VariableDefinitionNode>(node, VARIABLE_DEFINITION)) {
            return null;
          }

          return undefined;
        },
      });

      const { persistedFragmentSpreads, ...rest } = visitorContext;
      assign(context, rest);
      return { ast: updatedAST, request: print(updatedAST) };
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default function init(userOptions: UserOptions): RequestParserInit {
  if (!isPlainObject(userOptions)) {
    throw new TypeError("@graphql-box/request-parser expected userOptions to be a plain object.");
  }

  return (clientOptions: ClientOptions) => RequestParser.init({ ...clientOptions, ...userOptions });
}
