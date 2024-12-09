import { type PlainObject } from '@graphql-box/core';
import { encode } from 'js-base64';
import { get, merge } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.ts';
import { useRequest } from '../../hooks/useRequest.ts';
import { buildDependencyKey } from './helpers/buildDependencyKey.ts';
import { formatListings } from './helpers/formatListings.ts';
import { hasRequestPathChanged } from './helpers/hasRequestPathChanged.ts';
import { type ConnectionResponse, type ConnectionVariables, type ListingsData, type ListingsProps } from './types.ts';

const initialListingsData = {
  hasNextPage: true,
  listings: new Map(),
};

export const ConnectionListings = <Item extends PlainObject>(props: ListingsProps<Item>) => {
  const {
    awaitDataCaching,
    batch,
    children,
    fragments,
    intersectionRoot = null,
    intersectionRootMargin = '0px',
    intersectionThreshold = 0,
    query,
    renderError,
    renderLoader,
    requestPath,
    resultsPerRequest = 20,
    returnCacheMetadata,
    tag,
    variables,
  } = props;

  const [{ hasNextPage, listings }, setListingsData] = useState<ListingsData<Item>>(initialListingsData);
  const [connectionVariables, setConnectionVariables] = useState<ConnectionVariables>({ first: resultsPerRequest });

  const { data, errors, execute, loading, paths, requestID } = useRequest<ConnectionResponse<Item>>(query, {
    loading: true,
  });

  const [lastItemReference, isLastItemVisible] = useIntersectionObserver({
    root: intersectionRoot,
    rootMargin: intersectionRootMargin,
    threshold: intersectionThreshold,
  });

  const previousVariablesHashes = useRef<Map<string, string | undefined>>(new Map());
  const queryHash = encode(query);
  const variablesHash = encode(JSON.stringify({ ...variables, requestPath }));

  const dependenciesKey = buildDependencyKey(
    requestID,
    get(data, `${requestPath}.pageInfo.startCursor`) as string | null | undefined,
    paths,
  );

  useEffect(() => {
    if (variablesHash !== previousVariablesHashes.current.get(queryHash) || hasRequestPathChanged(requestPath, data)) {
      const newConnectionVariables = { ...connectionVariables, after: undefined };

      void execute({
        awaitDataCaching,
        batch,
        fragments,
        returnCacheMetadata,
        tag,
        variables: { ...variables, ...newConnectionVariables },
      });

      if (listings.size > 0) {
        setListingsData({ hasNextPage: true, listings: new Map() });
        setConnectionVariables(newConnectionVariables);
      }
    }

    if (isLastItemVisible && hasNextPage) {
      void execute({ variables: { ...variables, ...connectionVariables } });
    }
  }, [variablesHash, isLastItemVisible, hasNextPage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!data) {
      return;
    }

    const requestPathData = get(data, requestPath);

    if (!requestPathData) {
      return;
    }

    if (paths) {
      const existingItem = listings.get(requestID) ?? {};
      const listing = merge({}, existingItem, data);

      setListingsData({
        hasNextPage,
        listings: new Map([...listings, [requestID, listing]]),
      });

      return;
    }

    const { pageInfo } = requestPathData;

    setListingsData({
      hasNextPage: pageInfo.hasNextPage,
      listings:
        variablesHash === previousVariablesHashes.current.get(queryHash)
          ? new Map([...listings, [requestID, data]])
          : new Map([[requestID, data]]),
    });

    setConnectionVariables({ ...connectionVariables, after: pageInfo.endCursor ?? undefined });
  }, [dependenciesKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!loading) {
      previousVariablesHashes.current.set(queryHash, variablesHash);
    }
  }, [dependenciesKey, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  if (
    ((variablesHash !== previousVariablesHashes.current.get(queryHash) && loading) ||
      hasRequestPathChanged(requestPath, data)) &&
    renderLoader
  ) {
    return renderLoader();
  }

  if (errors.length > 0 && renderError) {
    return renderError(errors);
  }

  return children({
    hasNextPage,
    lastItemRef: lastItemReference,
    listings: formatListings<Item>(listings, requestPath),
    loading,
  });
};
