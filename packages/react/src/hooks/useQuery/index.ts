import { MaybeRequestResult, PlainObjectMap, RequestOptions } from "@graphql-box/core";
import { forAwaitEach, isAsyncIterable } from "iterall";
import { castArray } from "lodash";
import { useState } from "react";
import useGraphqlBoxClient from "../useGraphqlBoxClient";

export type State<Data extends PlainObjectMap> = {
  data: Data | null | undefined;
  errors: readonly Error[];
  hasNext?: boolean;
  loading: boolean;
};

const useQuery = <Data extends PlainObjectMap>(query: string, { loading = false } = {}) => {
  const graphqlBoxClient = useGraphqlBoxClient();
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

    forAwaitEach(requestResult, ({ data, errors, hasNext }: MaybeRequestResult) => {
      setState({
        data: data as Data,
        errors: errors ? castArray(errors) : [],
        hasNext,
        loading: false,
      });
    });
  };

  return { executeQuery, ...state };
};

export default useQuery;
