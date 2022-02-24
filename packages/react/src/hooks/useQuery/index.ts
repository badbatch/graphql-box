import { MaybeRequestResult, PlainObjectMap, RequestOptions } from "@graphql-box/core";
import { forAwaitEach, isAsyncIterable } from "iterall";
import { castArray } from "lodash";
import { useState } from "react";
import useGraphQLBoxClient from "../useGraphQLBoxClient";

export type State<Data extends PlainObjectMap> = {
  data: Data | null | undefined;
  errors: readonly Error[];
  hasNext?: boolean;
  loading: boolean;
  path?: (string | number)[] | (string | number)[][];
};

const useQuery = <Data extends PlainObjectMap>(query: string, { loading = false } = {}) => {
  const graphqlBoxClient = useGraphQLBoxClient();
  const [state, setState] = useState<State<Data>>({ data: undefined, errors: [], loading });

  const executeQuery = async (opts?: RequestOptions) => {
    setState({
      data: undefined,
      errors: [],
      hasNext: undefined,
      loading: true,
    });

    const requestResult = await graphqlBoxClient.request(query, opts);

    if (!isAsyncIterable(requestResult)) {
      const { data, errors } = requestResult as MaybeRequestResult;

      setState({
        data: data as Data,
        errors: errors ? castArray(errors) : [],
        loading: false,
      });

      return;
    }

    forAwaitEach(requestResult, ({ data, errors, hasNext, path }: MaybeRequestResult) => {
      setState({
        data: data as Data,
        errors: errors ? castArray(errors) : [],
        hasNext,
        loading: false,
        path,
      });
    });
  };

  return { executeQuery, ...state };
};

export default useQuery;
