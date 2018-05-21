import {
  ASTNode,
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
  ValueNode,
  VariableNode,
  visit,
} from "graphql";

import {
  isObjectLike,
  isPlainObject,
  isString,
} from "lodash";

import { MapFieldToTypeArgs } from "./types";

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
} from "../helpers/parsing";

import { getDirectives } from "../helpers/parsing/directives";
import { FragmentDefinitionNodeMap } from "../helpers/parsing/types";

import {
  ObjectMap,
  RequestContext,
  RequestOptions,
} from "../types";

export class RequestParser {
  private static _concatFragments(query: string, fragments: string[]): string {
    return [query, ...fragments].join("\n\n");
  }

  private static _mapFieldToType(args: MapFieldToTypeArgs): void {
    const { ancestors, context, fieldNode, isEntity, resourceKey, typeName, variables } = args;
    const ancestorFieldPath: string[] = [];

    ancestors.forEach((ancestor) => {
      if (isPlainObject(ancestor) && getKind(ancestor as ASTNode) === "Field") {
        const ancestorFieldNode = ancestor as FieldNode;
        ancestorFieldPath.push(getAlias(ancestorFieldNode) || getName(ancestorFieldNode) as string);
      }
    });

    const fieldName = getAlias(fieldNode) || getName(fieldNode) as string;
    ancestorFieldPath.push(fieldName);
    const fieldPath = ancestorFieldPath.join(".");
    const argumentsObjectMap = getArguments(fieldNode);
    const directives = getDirectives(fieldNode);
    let resourceValue: string | undefined;

    if (argumentsObjectMap) {
      if (argumentsObjectMap[resourceKey]) {
        resourceValue = argumentsObjectMap[resourceKey];
      } else if (variables && variables[resourceKey]) {
        resourceValue = variables[resourceKey];
      }
    }

    const { fieldTypeMap } = context;

    fieldTypeMap.set(fieldPath, {
      hasArguments: !!argumentsObjectMap,
      hasDirectives: !!directives,
      isEntity,
      resourceValue,
      typeName,
    });
  }

  private _resourceKey: string = "id";
  private _schema: GraphQLSchema;

  constructor(schema: GraphQLSchema, resourceKey: string) {
    this._resourceKey = resourceKey;
    this._schema = schema;
  }

  public async updateRequest(
    query: string,
    opts: RequestOptions,
    context: RequestContext,
  ): Promise<{ ast: DocumentNode, query: string }> {
    const _this = this;
    const _query = opts.fragments ? RequestParser._concatFragments(query, opts.fragments) : query;
    const typeInfo = new TypeInfo(this._schema);
    let fragmentDefinitions: FragmentDefinitionNodeMap | undefined;

    const ast = visit(parse(_query), {
      enter(
        node: ASTNode,
        key: string | number,
        parent: any,
        path: Array<string | number>,
        ancestors: any[],
      ): ValueNode | undefined {
        typeInfo.enter(node);
        const kind = getKind(node);

        if (kind === "Document") {
          const documentNode = node as DocumentNode;
          if (!opts.fragments || !hasFragmentDefinitions(documentNode)) return undefined;
          fragmentDefinitions = getFragmentDefinitions(documentNode);
          deleteFragmentDefinitions(documentNode);
          return undefined;
        }

        if (kind === "Field" || kind === "InlineFragment") {
          const fieldOrInlineFragmentNode = node as FieldNode | InlineFragmentNode;
          const type = _this._getFieldOrInlineFragmentType(kind, fieldOrInlineFragmentNode, typeInfo);
          if (!type) return undefined;

          if (kind === "Field") {
            const fieldNode = node as FieldNode;

            if (fragmentDefinitions && hasFragmentSpreads(fieldNode)) {
              setFragmentDefinitions(fragmentDefinitions, fieldNode);
            }
          }

          if (!(type instanceof GraphQLObjectType) && !(type instanceof GraphQLInterfaceType)) return undefined;
          const objectOrInterfaceType = type;
          const fields = objectOrInterfaceType.getFields();

          if (kind === "Field") {
            const fieldNode = node as FieldNode;

            RequestParser._mapFieldToType({
              ancestors,
              context,
              fieldNode,
              isEntity: !!fields[_this._resourceKey],
              resourceKey: _this._resourceKey,
              typeName: objectOrInterfaceType.name,
              variables: opts.variables,
            });
          }

          if (fields[_this._resourceKey]) {
            if (!hasChildFields(fieldOrInlineFragmentNode, _this._resourceKey)) {
              const mockAST = parse(`{${_this._resourceKey}}`);
              const queryNode = getOperationDefinitions(mockAST, "query")[0];
              const field = getChildFields(queryNode, _this._resourceKey) as FieldNode;
              addChildField(fieldOrInlineFragmentNode, field, _this._schema, _this._resourceKey);
            }
          }

          if (fields._metadata && !hasChildFields(fieldOrInlineFragmentNode, "_metadata")) {
            const mockAST = parse(`{ _metadata { cacheControl } }`);
            const queryNode = getOperationDefinitions(mockAST, "query")[0];
            const field = getChildFields(queryNode, "_metadata") as FieldNode;
            addChildField(fieldOrInlineFragmentNode, field, _this._schema, _this._resourceKey);
          }

          return undefined;
        }

        if (kind === "OperationDefinition") {
          const operationDefinitionNode = node as OperationDefinitionNode;
          if (!opts.variables || !hasVariableDefinitions(operationDefinitionNode)) return undefined;
          deleteVariableDefinitions(operationDefinitionNode);
          return undefined;
        }

        if (kind === "Variable") {
          if (!opts.variables) return parseValue(`${null}`);
          const variableNode = node as VariableNode;
          const name = getName(variableNode) as string;
          const value = opts.variables[name];
          if (!value) return parseValue(`${null}`);
          if (isObjectLike(value)) return parseValue(_this._parseToInputString(value));
          return parseValue(isString(value) ? `"${value}"` : `${value}`);
        }

        return undefined;
      },
      leave(node: ASTNode): any {
        typeInfo.leave(node);
      },
    });

    return { ast, query: print(ast) };
  }

  private _getFieldOrInlineFragmentType(
    kind: "Field" | "InlineFragment",
    node: FieldNode | InlineFragmentNode,
    typeInfo: TypeInfo,
  ): GraphQLOutputType | GraphQLNamedType | undefined {
    if (kind === "Field") {
      const typeDef = typeInfo.getFieldDef();
      return typeDef ? getType(typeDef) : undefined;
    }

    if (kind  === "InlineFragment") {
      const inlineFragmentNode = node as InlineFragmentNode;
      if (!inlineFragmentNode.typeCondition) return undefined;
      const name = getName(inlineFragmentNode.typeCondition) as string;
      if (name === typeInfo.getParentType().name) return undefined;
      return this._schema.getType(name);
    }

    return undefined;
  }

  private _parseArrayToInputString(values: any[]): string {
    let inputString = "[";

    values.forEach((value, index, arr) => {
      if (!isPlainObject(value)) {
        inputString += isString(value) ? `"${value}"` : `${value}`;
      } else {
        inputString += this._parseToInputString(value);
      }

      if (index < arr.length - 1) { inputString += ","; }
    });

    inputString += "]";
    return inputString;
  }

  private _parseObjectToInputString(obj: ObjectMap): string {
    let inputString = "{";

    Object.keys(obj).forEach((key, index, arr) => {
      inputString += `${key}:`;

      if (!isPlainObject(obj[key])) {
        inputString += isString(obj[key]) ? `"${obj[key]}"` : `${obj[key]}`;
      } else {
        inputString += this._parseToInputString(obj[key]);
      }

      if (index < arr.length - 1) { inputString += ","; }
    });

    inputString += "}";
    return inputString;
  }

  private _parseToInputString(value: ObjectMap | any[]): string {
    if (isPlainObject(value)) return this._parseObjectToInputString(value as ObjectMap);
    return this._parseArrayToInputString(value as any[]);
  }
}
