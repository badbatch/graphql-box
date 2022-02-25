import {
  DehydratedCacheMetadata,
  MaybeRawResponseData,
  MaybeRequestResult,
  PlainObjectMap,
  RequestContext,
  RequestDataWithMaybeAST,
  ServerRequestOptions,
  SubscriberResolver,
  SubscriptionsManagerInit,
} from "@graphql-box/core";
import { EventAsyncIterator, setCacheMetadata, standardizePath } from "@graphql-box/helpers";
import EventEmitter from "eventemitter3";
import { AsyncExecutionResult, GraphQLFieldResolver, GraphQLSchema, parse, subscribe } from "graphql";
import { forAwaitEach, isAsyncIterable } from "iterall";
import { isPlainObject } from "lodash";
import { ConstructorOptions, GraphQLSubscribe, InitOptions, SubscribeArgs, UserOptions } from "../defs";

export class Subscribe {
  public static async init(options: InitOptions): Promise<Subscribe> {
    const errors: TypeError[] = [];

    if (!(options.schema instanceof GraphQLSchema)) {
      errors.push(new TypeError("@graphql-box/subscribe expected options.schema to be a GraphQL schema."));
    }

    if (errors.length) return Promise.reject(errors);

    return new Subscribe(options);
  }

  private _contextValue: PlainObjectMap;
  private _eventEmitter: EventEmitter;
  private _fieldResolver?: GraphQLFieldResolver<any, any> | null;
  private _rootValue: any;
  private _schema: GraphQLSchema;
  private _subscribe: GraphQLSubscribe;
  private _subscribeFieldResolver?: GraphQLFieldResolver<any, any> | null;

  constructor(options: ConstructorOptions) {
    this._contextValue = options.contextValue || {};
    this._eventEmitter = new EventEmitter();
    this._fieldResolver = options.fieldResolver || null;
    this._rootValue = options.rootValue;
    this._schema = options.schema;
    this._subscribe = options.subscribe || (subscribe as GraphQLSubscribe);
    this._subscribeFieldResolver = options.subscribeFieldResolver || null;
  }

  public async subscribe(
    { ast, hash, request }: RequestDataWithMaybeAST,
    options: ServerRequestOptions,
    context: RequestContext,
    subscriberResolver: SubscriberResolver,
  ): Promise<AsyncIterator<MaybeRequestResult | undefined>> {
    const { contextValue = {}, fieldResolver, operationName, rootValue, subscribeFieldResolver } = options;
    const _cacheMetadata: DehydratedCacheMetadata = {};

    const subscribeArgs: SubscribeArgs = {
      contextValue: {
        ...this._contextValue,
        ...contextValue,
        boxID: context.boxID,
        setCacheMetadata: setCacheMetadata(_cacheMetadata),
      },
      document: ast || parse(request),
      fieldResolver: fieldResolver || this._fieldResolver,
      operationName,
      rootValue: rootValue || this._rootValue,
      schema: this._schema,
      subscribeFieldResolver: subscribeFieldResolver || this._subscribeFieldResolver,
    };

    try {
      const subscribeResult = await this._subscribe(subscribeArgs);

      if (isAsyncIterable(subscribeResult)) {
        forAwaitEach(subscribeResult, async (result: AsyncExecutionResult) => {
          context.normalizePatchResponseData = !!("path" in result);

          this._eventEmitter.emit(
            hash,
            await subscriberResolver(({
              _cacheMetadata,
              ...standardizePath(result),
            } as unknown) as MaybeRawResponseData),
          );
        });
      }

      const eventAsyncIterator = new EventAsyncIterator<MaybeRequestResult>(this._eventEmitter, hash);
      return eventAsyncIterator.getIterator();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default function init(userOptions: UserOptions): SubscriptionsManagerInit {
  if (!isPlainObject(userOptions)) {
    throw new TypeError("@graphql-box/subscribe expected userOptions to be a plain object.");
  }

  return () => Subscribe.init(userOptions);
}
