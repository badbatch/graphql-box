import {
  type CacheMetadata,
  type OperationContext,
  type OperationData,
  type OperationOptions,
  type PlainObject,
  type ResponseData,
} from '@graphql-box/core';
import { ArgsError, GroupedError, getFragmentDefinitions, setCacheMetadata } from '@graphql-box/helpers';
import { type ExecutionArgs, type GraphQLFieldResolver, GraphQLSchema, execute } from 'graphql';
import { omit } from 'lodash-es';
import { isAsyncIterableTypeGuard } from '#helpers/isAsyncIterableTypeGuard.ts';
import { logExecute } from './debug/logExecute.ts';
import { type GraphQLExecute, type UserOptions } from './types.ts';

export class Execute {
  private readonly _contextValue: PlainObject & { data?: PlainObject };
  private readonly _execute: GraphQLExecute;
  private readonly _fieldResolver?: GraphQLFieldResolver<unknown, unknown> | null;
  private readonly _rootValue: unknown;
  private readonly _schema: GraphQLSchema;

  constructor(options: UserOptions) {
    const errors: ArgsError[] = [];

    if (!(options.schema instanceof GraphQLSchema)) {
      errors.push(new ArgsError('@graphql-box/execute expected options.schema to be a GraphQL schema.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@graphql-box/execute argument validation errors.', errors);
    }

    this._contextValue = options.contextValue ?? {};
    this._execute = options.execute ?? execute;
    this._fieldResolver = options.fieldResolver ?? null;
    this._rootValue = options.rootValue;
    this._schema = options.schema;
  }

  @logExecute()
  public async execute(
    { ast }: OperationData,
    options: OperationOptions,
    context: OperationContext,
  ): Promise<ResponseData> {
    const { contextValue = {} } = options;
    const cacheMetadata: CacheMetadata = {};

    const executeArgs: ExecutionArgs = {
      contextValue: {
        ...this._contextValue,
        ...contextValue,
        data: {
          ...omit(context.data, ['variables', 'tag', 'requestDepth', 'requestComplexity', 'queryFiltered']),
          ...this._contextValue.data,
          ...contextValue.data,
        },
        debugManager: context.debugManager,
        fragmentDefinitions: getFragmentDefinitions(ast),
        setCacheMetadata: setCacheMetadata(cacheMetadata),
      },
      document: ast,
      fieldResolver: this._fieldResolver,
      rootValue: this._rootValue,
      schema: this._schema,
    };

    const executeResult = await this._execute(executeArgs);

    if (isAsyncIterableTypeGuard(executeResult)) {
      throw new Error('Returning async iterator from `execute` is not supported.');
    }

    const { data, errors } = executeResult;

    return {
      data: data ?? undefined,
      errors,
      extensions: { cacheMetadata: { ...cacheMetadata } },
    };
  }
}
