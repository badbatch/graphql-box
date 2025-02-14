import { type PartialRequestResult, type PlainObject, type RequestOptions } from '@graphql-box/core';
import { isAsyncIterable } from 'iterall';
import { useState } from 'react';
import { useGraphqlBoxClient } from './useGraphqlBoxClient.ts';

export type State<Data extends PlainObject> = {
  data: Data | null | undefined;
  errors: readonly Error[];
  loading: boolean;
  requestID: string;
};

export const useQuery = <Data extends PlainObject>(request: string, { loading = false } = {}) => {
  const graphqlBoxClient = useGraphqlBoxClient();
  const [state, setState] = useState<State<Data>>({ data: undefined, errors: [], loading, requestID: '' });

  const execute = async (options?: RequestOptions) => {
    setState({ ...state, loading: true });
    const requestResult = await graphqlBoxClient.query(request, options);

    if (isAsyncIterable(requestResult)) {
      throw new Error('useQuery does not support returning async iterators from queries');
    }

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
  };

  return { execute, ...state };
};
