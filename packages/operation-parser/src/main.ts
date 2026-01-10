import { type OperationContext, type OperationData, type OperationOptions } from '@graphql-box/core';
import { ArgsError, GroupedError, getOperationDefinitions, hashOperation, isPlainObject } from '@graphql-box/helpers';
import { GraphQLSchema, buildClientSchema, parse, print } from 'graphql';
import { assign, isError } from 'lodash-es';
import { instrumentOperation } from '#helpers/instrumentOperation.ts';
import { normaliseOperation } from '#helpers/normaliseOperation.ts';
import { scoreOperation } from '#helpers/scoreOperation.ts';
import { validateOperation } from '#helpers/validateOperation.ts';
import { type OperationParserDef, type UserOptions } from './types.ts';

export class OperationParser implements OperationParserDef {
  private _idKey = 'id';
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
      throw new GroupedError('@graphql-box/operation-parser argument validation errors.', errors);
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
        : new ArgsError('@graphql-box/operation-parser expected introspection to be converted into a valid schema.');

      throw new GroupedError('@graphql-box/operation-parser argument validation errors.', [confirmedError]);
    }

    this._typeComplexityMap = options.typeComplexityMap;
  }

  public buildOperationData(operation: string, options: OperationOptions, context: OperationContext): OperationData {
    return this._buildOperationData(operation, options, context);
  }

  set idKeys(idKey: string) {
    this._idKey = idKey;
  }

  private _buildOperationData(operation: string, options: OperationOptions, context: OperationContext): OperationData {
    const operationWithFragments = options.fragments ? [operation, ...options.fragments].join('\n\n') : operation;
    const ast = parse(operationWithFragments);
    const operationDefinitions = getOperationDefinitions(ast);
    const [operationDefinition] = operationDefinitions;

    if (!operationDefinition || operationDefinitions.length > 1) {
      throw new Error(
        `@graphql-box/operation-parser expected one operation, but got ${String(operationDefinitions.length)}.`,
      );
    }

    const parsedAst = normaliseOperation(ast, this._schema, {
      idKey: this._idKey,
      operation,
      variables: options.variables,
    });

    const parsedOperation = print(parsedAst);

    const { depthChart, fieldPaths, typeOccurrences } = instrumentOperation(parsedAst, this._schema, {
      idKey: this._idKey,
      operation: parsedOperation,
      operationType: context.data.operationType,
    });

    const { fieldDepth, typeComplexity } = scoreOperation({
      depthChart,
      typeComplexityMap: this._typeComplexityMap,
      typeOccurrences,
    });

    validateOperation({
      ast: parsedAst,
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

    return {
      ast: parsedAst,
      hash: hashOperation(parsedOperation),
      operation: parsedOperation,
    };
  }
}
