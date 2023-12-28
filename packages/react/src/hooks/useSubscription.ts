import { type PartialRequestResult, type PlainObject, type RequestOptions } from '@graphql-box/core';
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

  const execute = async (options?: RequestOptions) => {
    setState({
      data: undefined,
      errors: [],
      hasNext: undefined,
      loading: true,
      requestID: '',
    });

    const subscribeResult = await graphqlBoxClient.subscribe(subscription, options);

    if (!isAsyncIterable(subscribeResult)) {
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
      const { data, errors, hasNext, paths, requestID } = result as PartialRequestResult;

      setState({
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
