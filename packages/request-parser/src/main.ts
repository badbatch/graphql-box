import { type RequestContext, type RequestOptions } from '@graphql-box/core';
import { ArgsError, GroupedError, getOperationDefinitions, hashRequest, isPlainObject } from '@graphql-box/helpers';
import { GraphQLSchema, buildClientSchema, parse, print } from 'graphql';
import { assign, isError } from 'lodash-es';
import { instrumentOperation } from '#helpers/instrumentOperation.ts';
import { parseOperation } from '#helpers/parseOperation.ts';
import { validateOperation } from '#helpers/validateOperation.ts';
import { type RequestParserDef, type UpdateRequestResult, type UserOptions } from './types.ts';

export class RequestParser implements RequestParserDef {
  private readonly _maxFieldDepth: number;
  private readonly _maxTypeComplexity: number;
  private readonly _schema: GraphQLSchema;
  private readonly _typeComplexityMap: Record<string, number> | undefined;

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

    this._typeComplexityMap = options.typeComplexityMap;
  }

  public updateRequest(request: string, options: RequestOptions, context: RequestContext): UpdateRequestResult {
    return this._updateRequest(request, options, context);
  }

  private _updateRequest(request: string, options: RequestOptions, context: RequestContext): UpdateRequestResult {
    const requestWithFragments = options.fragments ? [request, ...options.fragments].join('\n\n') : request;
    const ast = parse(requestWithFragments);
    const operationDefinitions = getOperationDefinitions(ast);
    const [operationDefinition] = operationDefinitions;

    if (!operationDefinition || operationDefinitions.length > 1) {
      throw new Error(
        `@graphql-box/request-parser expected one operation, but got ${String(operationDefinitions.length)}.`,
      );
    }

    const parsedAst = parseOperation(ast, this._schema, { query: request, variables: options.variables });
    const parsedOperation = print(parsedAst);

    const { depthChart, fieldPaths, typeList } = instrumentOperation(parsedAst, this._schema, {
      query: parsedOperation,
    });

    validateOperation({
      ast: parsedAst,
      depthChart,
      maxFieldDepth: this._maxFieldDepth,
      maxTypeComplexity: this._maxTypeComplexity,
      schema: this._schema,
      typeComplexityMap: this._typeComplexityMap,
      typeList,
    });

    assign(context, {
      data: assign(context.data, {
        operation: operationDefinition.operation,
        operationName: operationDefinition.name?.value ?? '',
      }),
      fieldPaths,
    });

    return {
      ast: parsedAst,
      hash: hashRequest(parsedOperation),
      request: parsedOperation,
    };
  }
}
