import {
  type CacheMetadata,
  type OperationOptions,
  type PartialOperationContext,
  type PlainObject,
  type ResponseData,
} from '@graphql-box/core';
import { type QueryError } from '@graphql-box/helpers';
import { useState } from 'react';
import { type Except } from 'type-fest';
import { useGraphqlBoxClient } from './useGraphqlBoxClient.ts';

export type State<T extends PlainObject<unknown> = PlainObject<unknown>> = {
  data: T[] | undefined;
  errors?: readonly Error[];
  extensions: Record<string, unknown> & { cacheMetadata: CacheMetadata };
  loading: boolean;
};

export const useMultiQuery = <T extends PlainObject<unknown> = PlainObject<unknown>>(
  request: string,
  { loading = false } = {},
) => {
  const graphqlBoxClient = useGraphqlBoxClient();

  const [state, setState] = useState<State<T>>({
    data: undefined,
    errors: [],
    extensions: { cacheMetadata: {} },
    loading,
  });

  const execute = async (optionsSet: OperationOptions[], context?: PartialOperationContext) => {
    setState({
      data: undefined,
      errors: [],
      extensions: { cacheMetadata: {} },
      loading: true,
    });

    const settledResult = await Promise.allSettled(
      optionsSet.map(options => graphqlBoxClient.query(request, options, context)),
    );

    const requestResults: ResponseData[] = [];

    for (const result of settledResult) {
      if (result.status === 'fulfilled') {
        requestResults.push(result.value);
      } else {
        // reason is any type
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const { errors, extensions } = result.reason as QueryError;
        requestResults.push({ errors, extensions });
      }
    }

    const { data, errors, extensions } = requestResults.reduce<Except<State<T>, 'loading'>>(
      (acc: Except<State<T>, 'loading'>, result): Except<State<T>, 'loading'> => {
        return {
          // @ts-expect-error Struggling to type this nicely
          data: result.data ? [...(acc.data ?? []), result.data] : acc.data,
          errors: result.errors?.length ? [...(acc.errors ?? []), ...result.errors] : acc.errors,
          extensions: {
            ...acc.extensions,
            cacheMetadata: {
              ...acc.extensions.cacheMetadata,
              ...result.extensions.cacheMetadata,
            },
          },
        };
      },
      { data: [], errors: [], extensions: { cacheMetadata: {} } },
    );

    setState({
      data,
      errors,
      extensions,
      loading: false,
    });
  };

  return { execute, ...state };
};
