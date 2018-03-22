import * as EventEmitter from "eventemitter3";

import {
  DocumentNode,
  ExecutionResult,
  GraphQLFieldResolver,
  GraphQLSchema,
  subscribe,
} from "graphql";

import { isFunction } from "lodash";
import { GraphQLSubscribeProxyArgs } from "./types";
import EventAsyncIterator from "../../event-async-iterator";
import { RequestOptions, SubscriberResolver } from "../../types";
import { forAwaitEach, isAsyncIterable } from "iterall";

export default class GraphQLSubscribeProxy {
  private _eventEmitter: EventEmitter;
  private _fieldResolver?: GraphQLFieldResolver<any, any>;
  private _rootValue: any;
  private _schema: GraphQLSchema;
  private _subscribeFieldResolver?: GraphQLFieldResolver<any, any>;

  constructor({ fieldResolver, rootValue, schema, subscribeFieldResolver }: GraphQLSubscribeProxyArgs) {
    this._eventEmitter = new EventEmitter();
    if (isFunction(fieldResolver)) this._fieldResolver = fieldResolver;
    this._rootValue = rootValue;
    this._schema = schema;
    if (isFunction(subscribeFieldResolver)) this._subscribeFieldResolver = subscribeFieldResolver;
  }

  public async resolve(
    subscription: string,
    hash: string,
    ast: DocumentNode,
    subscriberResolver: SubscriberResolver,
    opts: RequestOptions,
  ): Promise<AsyncIterator<any> | ExecutionResult> {
    try {
      const subscribeResult = await subscribe(
        this._schema,
        ast,
        this._rootValue,
        opts.contextValue,
        undefined,
        opts.operationName,
        this._fieldResolver,
        this._subscribeFieldResolver,
      );

      if (isAsyncIterable(subscribeResult)) {
        forAwaitEach(subscribeResult, async (result) => {
          const resolvedResult = await subscriberResolver(result);
          this._eventEmitter.emit(hash, resolvedResult);
        });

        const eventAsyncIterator = new EventAsyncIterator(this._eventEmitter, hash);
        return eventAsyncIterator.getIterator();
      } else {
        return subscribeResult as ExecutionResult;
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
