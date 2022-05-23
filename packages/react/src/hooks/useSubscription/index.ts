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

const useSubscription = <Data extends PlainObjectMap>(subscription: string, { loading = false } = {}) => {
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

    const subscribeResult = await graphqlBoxClient.subscribe(subscription, opts);

    if (!isAsyncIterable(subscribeResult)) {
      const { errors, requestID } = subscribeResult as MaybeRequestResult;

      setState({
        data: undefined,
        errors: errors ?? [],
        loading: false,
        requestID,
      });

      return;
    }

    forAwaitEach(subscribeResult, result => {
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

export default useSubscription;
