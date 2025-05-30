import { type PlainObject } from '@graphql-box/core';
import { encode } from 'js-base64';
import { get } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '#hooks/useIntersectionObserver.ts';
import { useQuery } from '#hooks/useQuery.ts';
import { buildDependencyKey } from './helpers/buildDependencyKey.ts';
import { filterOutDuplicateEntities } from './helpers/filterOutDuplicateEntities.ts';
import { formatListings } from './helpers/formatListings.ts';
import { getLastListingsEntry } from './helpers/getLastListingsEntry.ts';
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
    componentName,
    debug = false,
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

  const { data, errors, execute, loading, requestID } = useQuery<ConnectionResponse<Item>>(query, {
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
    // Typing get return value doesn't work very well
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    get(data, `${requestPath}.pageInfo.startCursor`) as string | null | undefined,
  );

  useEffect(() => {
    if (variablesHash !== previousVariablesHashes.current.get(queryHash) || hasRequestPathChanged(requestPath, data)) {
      const newConnectionVariables = { ...connectionVariables, after: undefined };

      void execute(
        {
          awaitDataCaching,
          batch,
          fragments,
          returnCacheMetadata,
          tag,
          variables: { ...variables, ...newConnectionVariables },
        },
        {
          data: {
            initiator: componentName,
          },
        },
      );

      if (listings.size > 0) {
        setListingsData({ hasNextPage: true, listings: new Map() });
        setConnectionVariables(newConnectionVariables);
      }
    }

    if (isLastItemVisible && hasNextPage) {
      void execute({ variables: { ...variables, ...connectionVariables } }, { data: { initiator: componentName } });
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

    const { pageInfo } = requestPathData;
    const filteredData = filterOutDuplicateEntities(getLastListingsEntry(listings), data, requestPath, debug);

    setListingsData({
      hasNextPage: pageInfo.hasNextPage,
      listings:
        variablesHash === previousVariablesHashes.current.get(queryHash)
          ? new Map([...listings, [requestID, filteredData]])
          : new Map([[requestID, filteredData]]),
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
