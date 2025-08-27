import { type RequestContext, type RequestOptions } from '@graphql-box/core';
import { ArgsError, GroupedError, getOperationDefinitions, hashRequest, isPlainObject } from '@graphql-box/helpers';
import { GraphQLSchema, buildClientSchema, parse, print, validate } from 'graphql';
import { assign, isError } from 'lodash-es';
import { instrumentOperation } from '#helpers/instrumentOperation.js';
import { parseOperation } from '#helpers/parseOperation.js';
import { calcTypeComplexity } from './helpers/calcTypeComplexity.ts';
import { getMaxDepthFromChart } from './helpers/getMaxDepthFromChart.ts';
import { type RequestParserDef, type UpdateRequestResult, type UserOptions } from './types.ts';

export class RequestParser implements RequestParserDef {
  private readonly _maxFieldDepth: number;
  private readonly _maxTypeComplexity: number;
  private readonly _schema: GraphQLSchema;
  private readonly _typeComplexityMap: Record<string, number> | null;

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
  }

  public updateRequest(request: string, options: RequestOptions, context: RequestContext): UpdateRequestResult {
    const updated = this._updateRequest(request, options, context);
    const errors = validate(this._schema, updated.ast);

    if (errors.length > 0) {
      throw new GroupedError('@graphql-box/request-parser AST validation errors.', errors);
    }

    return updated;
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

    const { depthChart, fieldPaths, typeList } = instrumentOperation(parsedAst, this._schema, {
      query: print(parsedAst),
    });

    const maxDepth = getMaxDepthFromChart(depthChart);

    if (maxDepth > this._maxFieldDepth) {
      throw new Error(
        `@graphql-box/request-parser >> request field depth of ${String(maxDepth)} exceeded max field depth of ${String(this._maxFieldDepth)}`,
      );
    }

    let typeComplexity: number | null = null;

    if (this._typeComplexityMap) {
      typeComplexity = calcTypeComplexity(typeList, this._typeComplexityMap);

      if (typeComplexity > this._maxTypeComplexity) {
        throw new Error(
          `@graphql-box/request-parser >> request type complexity of ${String(typeComplexity)} exceeded max type complexity of ${String(this._maxTypeComplexity)}`,
        );
      }
    }

    assign(context, {
      data: assign(context.data, {
        operation: operationDefinition.operation,
        operationName: operationDefinition.name?.value ?? '',
      }),
      fieldPaths,
    });

    const updatedOperation = print(parsedAst);
    return { ast: parsedAst, hash: hashRequest(updatedOperation), request: updatedOperation };
  }
}
