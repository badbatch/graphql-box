import {
  type PartialRequestContext,
  type PartialRequestResult,
  type PlainObject,
  type RequestOptions,
} from '@graphql-box/core';
import { useState } from 'react';
import { useGraphqlBoxClient } from './useGraphqlBoxClient.ts';

export type State<Data extends PlainObject> = {
  data: Data[] | undefined;
  errors: readonly Error[];
  loading: boolean;
};

export const useMultiRequest = <Data extends PlainObject>(request: string, { loading = false } = {}) => {
  const graphqlBoxClient = useGraphqlBoxClient();
  const [state, setState] = useState<State<Data>>({ data: undefined, errors: [], loading });

  const execute = async (optionsSet: RequestOptions[], context?: PartialRequestContext) => {
    setState({
      data: undefined,
      errors: [],
      loading: true,
    });

    // This hook cannot be used with defer/stream so doesn't support
    // returning an async iterator.
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const requestResults = (await Promise.all(
      optionsSet.map(options => graphqlBoxClient.request(request, options, context)),
    )) as PartialRequestResult[];

    setState({
      // @ts-expect-error Need to handle this properly
      data: requestResults.reduce<Data[]>((acc, result) => {
        if (result.data) {
          return [...acc, result.data];
        }

        return acc;
      }, []),
      errors: requestResults.reduce<readonly Error[]>((acc, result) => {
        if (result.errors?.length) {
          return [...acc, ...result.errors];
        }

        return acc;
      }, []),
      loading: false,
    });
  };

  return { execute, ...state };
};
