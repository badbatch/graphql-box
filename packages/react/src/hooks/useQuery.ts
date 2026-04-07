import {
  type OperationOptions,
  type PartialOperationContext,
  type PlainObject,
  type QueryResult,
} from '@graphql-box/core';
import { InternalError, QueryError } from '@graphql-box/helpers';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useGraphqlBoxClient } from './useGraphqlBoxClient.ts';

export type State<T extends PlainObject> =
  | {
      initial: true;
      loading: boolean;
      result: undefined;
    }
  | {
      loading: true;
      result: undefined;
    }
  | {
      loading: false;
      result: QueryResult<T> | QueryError;
    };

export const useQuery = <T extends PlainObject<unknown> = PlainObject<unknown>>(
  request: string,
  { loading = false } = {},
) => {
  const graphqlBoxClient = useGraphqlBoxClient();

  const [state, setState] = useState<State<T>>({
    initial: true,
    loading,
    result: undefined,
  });

  const execute = async (options?: OperationOptions, context?: PartialOperationContext) => {
    setState({
      loading: true,
      result: undefined,
    });

    const operationId = uuid();

    try {
      const result = await graphqlBoxClient.query<T>(request, options, {
        ...context,
        data: {
          ...context?.data,
          operationId,
        },
      });

      setState({
        loading: false,
        result,
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

      setState({
        loading: false,
        result: queryError,
      });
    }
  };

  return { execute, ...state };
};
