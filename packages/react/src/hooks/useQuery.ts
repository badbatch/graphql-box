import {
  type OperationOptions,
  type PartialOperationContext,
  type PlainObject,
  type QueryResult,
} from '@graphql-box/core';
import { InternalError, QueryError } from '@graphql-box/helpers';
import { useState } from 'react';
import { type SetOptional } from 'type-fest';
import { v4 as uuid } from 'uuid';
import { useGraphqlBoxClient } from './useGraphqlBoxClient.ts';

export type State<T extends PlainObject> = {
  loading: boolean;
} & SetOptional<QueryResult<T>, 'data'>;

export const useQuery = <T extends PlainObject<unknown> = PlainObject<unknown>>(
  request: string,
  { loading = false } = {},
) => {
  const graphqlBoxClient = useGraphqlBoxClient();

  const [state, setState] = useState<State<T>>({
    data: undefined,
    errors: [],
    extensions: { cacheMetadata: {} },
    loading,
    operationId: '',
  });

  const execute = async (options?: OperationOptions, context?: PartialOperationContext) => {
    setState({
      data: undefined,
      errors: [],
      extensions: { cacheMetadata: {} },
      loading: true,
      operationId: '',
    });

    const operationId = uuid();

    try {
      const { data, errors, extensions } = await graphqlBoxClient.query<T>(request, options, {
        ...context,
        data: {
          ...context?.data,
          operationId,
        },
      });

      setState({
        data,
        errors,
        extensions,
        loading: false,
        operationId,
      });
    } catch (error) {
      const queryError =
        error instanceof QueryError
          ? error
          : new QueryError(
              'Oops, something went wrong.',
              [new InternalError('Oops, something went wrong.', { cause: error })],
              { cacheMetadata: {} },
              operationId,
            );

      const { errors, extensions } = queryError;

      setState({
        data: undefined,
        errors,
        extensions,
        loading: false,
        operationId,
      });
    }
  };

  return { execute, ...state };
};
