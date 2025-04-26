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

export const useRequest = <Data extends PlainObject>(request: string, { loading = false } = {}) => {
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

    const requestResult = await graphqlBoxClient.request(request, options, context);

    if (!isAsyncIterable(requestResult)) {
      // Need to use a type guard
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const { data, errors, requestID } = requestResult as PartialRequestResult;

      setState({
        // Need to fix the types here
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        data: data as Data,
        errors: errors ?? [],
        loading: false,
        requestID,
      });

      return;
    }

    void forAwaitEach(requestResult, result => {
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
