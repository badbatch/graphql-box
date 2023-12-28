import {
  type AsyncExecutionResult,
  type DehydratedCacheMetadata,
  type PartialRawResponseData,
  type PartialRequestResult,
  type PlainObject,
  type RequestContext,
  type RequestData,
  type ServerRequestOptions,
  type SubscriberResolver,
} from '@graphql-box/core';
import {
  type ArgsError,
  EventAsyncIterator,
  GroupedError,
  getFragmentDefinitions,
  setCacheMetadata,
  standardizePath,
} from '@graphql-box/helpers';
import { EventEmitter } from 'eventemitter3';
import { type GraphQLFieldResolver, GraphQLSchema, subscribe } from 'graphql';
import { forAwaitEach, isAsyncIterable } from 'iterall';
import { type GraphQLSubscribe, type SubscribeArgs, type UserOptions } from './types.ts';

export class Subscribe {
  private _contextValue: PlainObject;
  private _eventEmitter: EventEmitter;
  private _fieldResolver?: GraphQLFieldResolver<unknown, unknown> | null;
  private _rootValue: unknown;
  private _schema: GraphQLSchema;
  private _subscribe: GraphQLSubscribe;
  private _subscribeFieldResolver?: GraphQLFieldResolver<unknown, unknown> | null;

  constructor(options: UserOptions) {
    const errors: ArgsError[] = [];

    if (!(options.schema instanceof GraphQLSchema)) {
      errors.push(new TypeError('@graphql-box/subscribe expected options.schema to be a GraphQL schema.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@graphql-box/subscribe argument validation errors.', errors);
    }

    this._contextValue = options.contextValue ?? {};
    this._eventEmitter = new EventEmitter();
    this._fieldResolver = options.fieldResolver ?? null;
    this._rootValue = options.rootValue;
    this._schema = options.schema;
    this._subscribe = options.subscribe ?? (subscribe as GraphQLSubscribe);
    this._subscribeFieldResolver = options.subscribeFieldResolver ?? null;
  }

  public async subscribe(
    { ast, hash }: RequestData,
    options: ServerRequestOptions,
    context: RequestContext,
    subscriberResolver: SubscriberResolver
  ): Promise<AsyncIterator<PartialRequestResult | undefined>> {
    const { contextValue = {}, fieldResolver, operationName, rootValue, subscribeFieldResolver } = options;
    const _cacheMetadata: DehydratedCacheMetadata = {};
    const { debugManager, requestID } = context;

    const subscribeArgs: SubscribeArgs = {
      contextValue: {
        ...this._contextValue,
        ...contextValue,
        debugManager,
        fragmentDefinitions: getFragmentDefinitions(ast),
        requestID,
        setCacheMetadata: setCacheMetadata(_cacheMetadata),
      },
      document: ast,
      fieldResolver: fieldResolver ?? this._fieldResolver,
      operationName,
      rootValue: rootValue || this._rootValue,
      schema: this._schema,
      subscribeFieldResolver: subscribeFieldResolver ?? this._subscribeFieldResolver,
    };

    const subscribeResult = await this._subscribe(subscribeArgs);

    if (isAsyncIterable(subscribeResult)) {
      void forAwaitEach(subscribeResult, async (result: AsyncExecutionResult) => {
        context.normalizePatchResponseData = !!('path' in result);

        this._eventEmitter.emit(
          hash,
          await subscriberResolver({
            _cacheMetadata,
            ...standardizePath(result),
          } as unknown as PartialRawResponseData)
        );
      });
    }

    const eventAsyncIterator = new EventAsyncIterator<PartialRequestResult>(this._eventEmitter, hash);
    return eventAsyncIterator.getIterator();
  }
}
