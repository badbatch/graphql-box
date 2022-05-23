import { PlainObjectMap } from "@graphql-box/core";
import { encode } from "js-base64";
import { get, merge } from "lodash";
import { useEffect, useRef, useState } from "react";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import useRequest from "../../hooks/useRequest";
import buildDependencyKey from "./helpers/buildDependencyKey";
import formatListings from "./helpers/formatListings";
import { ConnectionResponse, ConnectionVariables, ListingsData, ListingsProps, PageInfo } from "./types";

const initialListingsData = {
  hasNextPage: true,
  listings: new Map(),
};

export default <Item extends PlainObjectMap>(props: ListingsProps<Item>) => {
  const {
    children,
    intersectionRoot = null,
    intersectionRootMargin = "0px",
    intersectionThreshold = 0,
    query,
    renderError,
    renderLoader,
    requestPath,
    resultsPerRequest = 20,
    variables,
  } = props;

  const [{ hasNextPage, listings }, setListingsData] = useState<ListingsData<Item>>(initialListingsData);
  const [connectionVariables, setConnectionVariables] = useState<ConnectionVariables>({ first: resultsPerRequest });

  const { data, errors, execute, loading, paths, requestID } = useRequest<ConnectionResponse<Item>>(query, {
    loading: true,
  });

  const [lastItemRef, isLastItemVisible] = useIntersectionObserver({
    root: intersectionRoot,
    rootMargin: intersectionRootMargin,
    threshold: intersectionThreshold,
  });

  const prevVariablesHashes = useRef<Map<string, string | undefined>>(new Map());
  const queryHash = encode(query);
  const variablesHash = encode(JSON.stringify(variables));

  const dependenciesKey = buildDependencyKey(
    requestID,
    get(data, `${requestPath}.pageInfo.startCursor`) as string | null | undefined,
    paths,
  );

  useEffect(() => {
    if (variablesHash !== prevVariablesHashes.current.get(queryHash)) {
      const newConnectionVariables = { ...connectionVariables, after: undefined };
      execute({ variables: { ...variables, ...newConnectionVariables } });

      if (listings.size) {
        setListingsData({ hasNextPage: true, listings: new Map() });
        setConnectionVariables(newConnectionVariables);
      }
    }

    if (isLastItemVisible && hasNextPage) {
      execute({ variables: { ...variables, ...connectionVariables } });
    }
  }, [variablesHash, isLastItemVisible, hasNextPage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const requestPathData = get(data, requestPath);

    if (requestPathData) {
      if (paths) {
        const existingItem = listings.get(requestID) ?? {};
        const listing = merge({}, existingItem, data);

        setListingsData({
          hasNextPage,
          listings: new Map([...listings, [requestID, listing]]),
        });

        return;
      }

      const { pageInfo } = requestPathData as { pageInfo: PageInfo };

      setListingsData({
        hasNextPage: pageInfo.hasNextPage,
        listings:
          variablesHash === prevVariablesHashes.current.get(queryHash)
            ? new Map([...listings, [requestID, data as ConnectionResponse<Item>]])
            : new Map([[requestID, data as ConnectionResponse<Item>]]),
      });

      setConnectionVariables({ ...connectionVariables, after: pageInfo.endCursor ?? undefined });
    }
  }, [dependenciesKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!loading) {
      prevVariablesHashes.current.set(queryHash, variablesHash);
    }
  }, [dependenciesKey, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  if (variablesHash !== prevVariablesHashes.current.get(queryHash) && loading && renderLoader) {
    return renderLoader();
  }

  if (errors.length && renderError) {
    return renderError(errors);
  }

  return children({
    hasNextPage,
    lastItemRef,
    listings: formatListings<Item>(listings),
    loading,
  });
};
