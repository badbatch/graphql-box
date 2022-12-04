import {
  CacheMetadata,
  PlainObjectMap,
  RequestContext,
  RequestData,
  RequestResult,
  ServerRequestOptions,
  SubscriptionsManagerSubscribeResolver,
} from "@graphql-box/core";
import { EventAsyncIterator, getFragmentDefinitions, setCacheMetadata } from "@graphql-box/helpers";
import EventEmitter from "eventemitter3";
import { ExecutionArgs, GraphQLFieldResolver, GraphQLSchema, subscribe } from "graphql";
import { forAwaitEach, isAsyncIterable } from "iterall";
import { GraphQLSubscribe, UserOptions } from "../defs";

export default class Subscribe {
  private _contextValue: PlainObjectMap;
  private _eventEmitter: EventEmitter;
  private _fieldResolver?: GraphQLFieldResolver<any, any> | null;
  private _rootValue: any;
  private _schema: GraphQLSchema;
  private _subscribe: GraphQLSubscribe;
  private _subscribeFieldResolver?: GraphQLFieldResolver<any, any> | null;

  constructor(options: UserOptions) {
    const errors: TypeError[] = [];

    if (!(options.schema instanceof GraphQLSchema)) {
      errors.push(new TypeError("@graphql-box/subscribe expected options.schema to be a GraphQL schema."));
    }

    if (errors.length) {
      throw errors;
    }

    this._contextValue = options.contextValue || {};
    this._eventEmitter = new EventEmitter();
    this._fieldResolver = options.fieldResolver || null;
    this._rootValue = options.rootValue;
    this._schema = options.schema;
    this._subscribe = options.subscribe || (subscribe as GraphQLSubscribe);
    this._subscribeFieldResolver = options.subscribeFieldResolver || null;
  }

  public async subscribe(
    { ast, hash }: RequestData,
    options: ServerRequestOptions,
    context: RequestContext,
    subscriberResolver: SubscriptionsManagerSubscribeResolver,
  ): Promise<AsyncIterableIterator<RequestResult | undefined>> {
    const { contextValue = {}, fieldResolver, operationName, rootValue, subscribeFieldResolver } = options;
    const _cacheMetadata: CacheMetadata = new Map();
    const { debugManager, requestID } = context;

    const subscribeArgs: ExecutionArgs = {
      contextValue: {
        ...this._contextValue,
        ...contextValue,
        debugManager,
        fragmentDefinitions: getFragmentDefinitions(ast),
        requestID,
        setCacheMetadata: setCacheMetadata(_cacheMetadata),
      },
      document: ast,
      fieldResolver: fieldResolver || this._fieldResolver,
      operationName,
      rootValue: rootValue || this._rootValue,
      schema: this._schema,
      subscribeFieldResolver: subscribeFieldResolver || this._subscribeFieldResolver,
    };

    try {
      const subscribeResult = await this._subscribe(subscribeArgs);

      if (isAsyncIterable(subscribeResult)) {
        forAwaitEach(subscribeResult, async result => {
          this._eventEmitter.emit(
            hash,
            await subscriberResolver({
              _cacheMetadata,
              ...result,
            }),
          );
        });
      }

      return await new Promise(async resolve => {
        const eventAsyncIterator = new EventAsyncIterator<RequestResult>(this._eventEmitter, hash);
        resolve(eventAsyncIterator.getIterator());

        if (!isAsyncIterable(subscribeResult)) {
          this._eventEmitter.emit(
            hash,
            await subscriberResolver({
              _cacheMetadata,
              ...subscribeResult,
            }),
          );
        }
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
