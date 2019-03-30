import {
  MaybeRequestResult,
  RequestDataWithMaybeAST,
  ServerRequestOptions,
  SubscriberResolver,
  SubscriptionsManagerInit,
} from "@handl/core";
import { EventAsyncIterator } from "@handl/helpers";
import EventEmitter from "eventemitter3";
import {
  ExecutionResult,
  GraphQLFieldResolver,
  GraphQLSchema,
  parse,
  subscribe,
} from "graphql";
import { ExecutionResultDataDefault } from "graphql/execution/execute";
import { forAwaitEach, isAsyncIterable } from "iterall";
import { isPlainObject } from "lodash";
import { ConstructorOptions, GraphQLSubscribe, InitOptions, SubscribeArgs, UserOptions } from "../defs";

export class Subscribe {
  public static async init(options: InitOptions): Promise<Subscribe> {
    const errors: TypeError[] = [];

    if (!(options.schema instanceof GraphQLSchema)) {
      errors.push(new TypeError("@handl/subscribe expected options.schema to be a GraphQL schema."));
    }

    if (errors.length) return Promise.reject(errors);

    try {
      return new Subscribe(options);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _eventEmitter: EventEmitter;
  private _fieldResolver?: GraphQLFieldResolver<any, any> | null;
  private _rootValue: any;
  private _schema: GraphQLSchema;
  private _subscribe: GraphQLSubscribe;
  private _subscribeFieldResolver?: GraphQLFieldResolver<any, any> | null;

  constructor(options: ConstructorOptions) {
    this._eventEmitter = new EventEmitter();
    this._fieldResolver = options.fieldResolver || null;
    this._rootValue = options.rootValue;
    this._schema = options.schema;
    this._subscribe = options.subscribe || subscribe;
    this._subscribeFieldResolver = options.subscribeFieldResolver || null;
  }

  public async subscribe(
    { ast, hash, request }: RequestDataWithMaybeAST,
    options: ServerRequestOptions,
    subscriberResolver: SubscriberResolver,
  ): Promise<AsyncIterator<MaybeRequestResult | undefined>> {
    const { contextValue, fieldResolver, operationName, rootValue, subscribeFieldResolver } = options;

    const subscribeArgs: SubscribeArgs = {
      contextValue,
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
        forAwaitEach(subscribeResult, async ({ data, errors }: ExecutionResult<ExecutionResultDataDefault>) => {
          const resolvedResult = await subscriberResolver({ data, errors });
          this._eventEmitter.emit(hash, resolvedResult);
        });
      }

      const eventAsyncIterator = new EventAsyncIterator(this._eventEmitter, hash);
      return eventAsyncIterator.getIterator();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default function init(userOptions: UserOptions): SubscriptionsManagerInit {
  if (!isPlainObject(userOptions)) {
    throw new TypeError("@handl/subscribe expected userOptions to be a plain object.");
  }

  return () => Subscribe.init(userOptions);
}
