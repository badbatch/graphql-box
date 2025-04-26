import {
  type PartialRequestContext,
  type PartialRequestResult,
  type PlainObject,
  type RequestOptions,
} from '@graphql-box/core';
import { forAwaitEach, isAsyncIterable } from 'iterall';
import { useState } from 'react';
import { useGraphqlBoxClient } from './useGraphqlBoxClient.ts';

export type State<Data extends PlainObject> = {
  data: Data | null | undefined;
  errors: readonly Error[];
  hasNext?: boolean;
  loading: boolean;
  paths?: string[];
  requestID: string;
};

export const useSubscription = <Data extends PlainObject>(subscription: string, { loading = false } = {}) => {
  const graphqlBoxClient = useGraphqlBoxClient();
  const [state, setState] = useState<State<Data>>({ data: undefined, errors: [], loading, requestID: '' });

  const execute = async (options?: RequestOptions, context?: PartialRequestContext) => {
    setState({
      data: undefined,
      errors: [],
      hasNext: undefined,
      loading: true,
      requestID: '',
    });

    const subscribeResult = await graphqlBoxClient.subscribe(subscription, options, context);

    if (!isAsyncIterable(subscribeResult)) {
      // Need to use a type guard
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const { errors, requestID } = subscribeResult as PartialRequestResult;

      setState({
        data: undefined,
        errors: errors ?? [],
        loading: false,
        requestID,
      });

      return;
    }

    void forAwaitEach(subscribeResult, result => {
      // Need to use a type guard
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const { data, errors, hasNext, paths, requestID } = result as PartialRequestResult;

      setState({
        // Need to fix the types here
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        data: data as Data,
        errors: errors ?? [],
        hasNext,
        loading: false,
        paths,
        requestID,
      });
    });
  };

  return { execute, ...state };
};
