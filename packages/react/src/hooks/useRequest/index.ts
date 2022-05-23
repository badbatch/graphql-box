import { MaybeRequestResult, PlainObjectMap, RequestOptions } from "@graphql-box/core";
import { forAwaitEach, isAsyncIterable } from "iterall";
import { useState } from "react";
import useGraphQLBoxClient from "../useGraphQLBoxClient";

export type State<Data extends PlainObjectMap> = {
  data: Data | null | undefined;
  errors: readonly Error[];
  hasNext?: boolean;
  loading: boolean;
  paths?: string[];
  requestID: string;
};

const useRequest = <Data extends PlainObjectMap>(request: string, { loading = false } = {}) => {
  const graphqlBoxClient = useGraphQLBoxClient();
  const [state, setState] = useState<State<Data>>({ data: undefined, errors: [], loading, requestID: "" });

  const execute = async (opts?: RequestOptions) => {
    setState({
      data: undefined,
      errors: [],
      hasNext: undefined,
      loading: true,
      requestID: "",
    });

    const requestResult = await graphqlBoxClient.request(request, opts);

    if (!isAsyncIterable(requestResult)) {
      const { data, errors, requestID } = requestResult as MaybeRequestResult;

      setState({
        data: data as Data,
        errors: errors ?? [],
        loading: false,
        requestID,
      });

      return;
    }

    forAwaitEach(requestResult, result => {
      const { data, errors, hasNext, paths, requestID } = result as MaybeRequestResult;

      setState({
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

export default useRequest;
