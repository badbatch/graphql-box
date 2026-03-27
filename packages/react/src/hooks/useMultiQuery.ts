import {
  type OperationOptions,
  type PartialOperationContext,
  type PlainObject,
  type QueryResult,
} from '@graphql-box/core';
import { InternalError, QueryError } from '@graphql-box/helpers';
import { useState } from 'react';
import { useGraphqlBoxClient } from './useGraphqlBoxClient.ts';

export type State<T extends PlainObject<unknown> = PlainObject<unknown>> = {
  loading: boolean;
  results?: (QueryResult<T> | QueryError)[];
};

export const useMultiQuery = <T extends PlainObject<unknown> = PlainObject<unknown>>(
  request: string,
  { loading = false } = {},
) => {
  const graphqlBoxClient = useGraphqlBoxClient();

  const [state, setState] = useState<State<T>>({
    loading,
    results: undefined,
  });

  const execute = async (optionsSet: OperationOptions[], context?: PartialOperationContext) => {
    setState({
      loading: true,
      results: undefined,
    });

    const settledResult = await Promise.allSettled(
      optionsSet.map(options => graphqlBoxClient.query(request, options, context)),
    );

    const requestResults: (QueryResult<T> | QueryError)[] = [];

    for (const result of settledResult) {
      if (result.status === 'fulfilled') {
        // @ts-expect-error Struggling to align generics
        requestResults.push(result.value);
      } else {
        const queryError =
          result.reason instanceof QueryError
            ? result.reason
            : new QueryError(
                'There was a problem with useMultiQuery',
                [new InternalError('Oops, something went wrong.', { cause: result.reason })],
                { cacheMetadata: {} },
                'unknown',
              );

        requestResults.push(queryError);
      }
    }

    setState({
      loading: false,
      results: requestResults,
    });
  };

  return { execute, ...state };
};
