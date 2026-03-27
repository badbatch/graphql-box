import { type OperationContext, type OperationData, type OperationOptions } from '@graphql-box/core';
import { ArgsError, InternalError, getOperationDefinitions, hashOperation, isPlainObject } from '@graphql-box/helpers';
import { GraphQLSchema, buildClientSchema, parse, print } from 'graphql';
import { assign, isError } from 'lodash-es';
import { instrumentOperation } from '#helpers/instrumentOperation.ts';
import { normaliseOperation } from '#helpers/normaliseOperation.ts';
import { scoreOperation } from '#helpers/scoreOperation.ts';
import { validateOperation } from '#helpers/validateOperation.ts';
import { type OperationParserDef, type UserOptions } from './types.ts';

export class OperationParser implements OperationParserDef {
  private readonly _maxFieldDepth: number;
  private readonly _maxTypeComplexity: number;
  private readonly _schema: GraphQLSchema;
  private readonly _typeComplexityMap: Record<string, number> | undefined;

  constructor(options: UserOptions) {
    const errors: ArgsError[] = [];

    if (!isPlainObject(options.introspection) && !(options.schema instanceof GraphQLSchema)) {
      const message =
        '@graphql-box/operation-parser expected introspection to be an object or schema to be a GraphQLSchema';

      errors.push(new ArgsError(message));
    }

    if (errors.length > 0) {
      throw new AggregateError(errors, '@graphql-box/operation-parser argument validation errors.');
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
        : new ArgsError('@graphql-box/operation-parser expected introspection to be converted into a valid schema.', {
            cause: error,
          });

      throw new AggregateError([confirmedError], '@graphql-box/operation-parser argument validation errors.');
    }

    this._typeComplexityMap = options.typeComplexityMap;
  }

  public buildOperationData(operation: string, options: OperationOptions, context: OperationContext): OperationData {
    return this._buildOperationData(operation, options, context);
  }

  private _buildOperationData(operation: string, options: OperationOptions, context: OperationContext): OperationData {
    const operationWithFragments = options.fragments ? [operation, ...options.fragments].join('\n\n') : operation;
    const ast = parse(operationWithFragments);
    const operationDefinitions = getOperationDefinitions(ast);
    const [operationDefinition] = operationDefinitions;

    if (!operationDefinition || operationDefinitions.length > 1) {
      throw new InternalError(
        `@graphql-box/operation-parser expected one operation, but got ${String(operationDefinitions.length)}.`,
      );
    }

    const parsedAst = normaliseOperation(ast, this._schema, {
      operation,
      variables: options.variables,
    });

    const parsedOperation = print(parsedAst);

    const { depthChart, fieldPaths, instrumentedAst, typeOccurrences } = instrumentOperation(parsedAst, this._schema, {
      idKey: context.idKey,
      operation: parsedOperation,
      operationType: context.data.operationType,
    });

    const { fieldDepth, typeComplexity } = scoreOperation({
      depthChart,
      typeComplexityMap: this._typeComplexityMap,
      typeOccurrences,
    });

    validateOperation({
      ast: instrumentedAst,
      fieldDepth,
      maxFieldDepth: this._maxFieldDepth,
      maxTypeComplexity: this._maxTypeComplexity,
      schema: this._schema,
      typeComplexity,
    });

    assign(context, {
      data: assign(context.data, {
        operationMaxFieldDepth: fieldDepth,
        operationName: operationDefinition.name?.value ?? '',
        operationType: operationDefinition.operation,
        operationTypeComplexity: typeComplexity,
      }),
      fieldPaths,
    });

    const instrumentedOperation = print(instrumentedAst);

    return {
      ast: instrumentedAst,
      hash: hashOperation(instrumentedOperation),
      operation: instrumentedOperation,
    };
  }
}
