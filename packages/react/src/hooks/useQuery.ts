import { type OperationOptions, type PartialOperationContext, type PlainObject } from '@graphql-box/core';
import { useState } from 'react';
import { useGraphqlBoxClient } from './useGraphqlBoxClient.ts';

export type State<Data extends PlainObject> = {
  data: Data | null | undefined;
  errors: readonly Error[];
  loading: boolean;
  operationId: string;
};

export const useQuery = <Data extends PlainObject>(request: string, { loading = false } = {}) => {
  const graphqlBoxClient = useGraphqlBoxClient();
  const [state, setState] = useState<State<Data>>({ data: undefined, errors: [], loading, operationId: '' });

  const execute = async (options?: OperationOptions, context?: PartialOperationContext) => {
    setState({
      data: undefined,
      errors: [],
      loading: true,
      operationId: '',
    });

    const requestResult = await graphqlBoxClient.query<Data>(request, options, context);
    const { data, errors, operationId } = requestResult;

    setState({
      data,
      errors: errors ?? [],
      loading: false,
      operationId,
    });
  };

  return { execute, ...state };
};
