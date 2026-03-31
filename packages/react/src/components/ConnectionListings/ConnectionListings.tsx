import { type PlainObject } from '@graphql-box/core';
import { encode } from 'js-base64';
import { get } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '#hooks/useIntersectionObserver.ts';
import { buildDependencyKey } from './helpers/buildDependencyKey.ts';
import { filterOutDuplicateEntities } from './helpers/filterOutDuplicateEntities.ts';
import { formatListings } from './helpers/formatListings.ts';
import { getLastListingsEntry } from './helpers/getLastListingsEntry.ts';
import { hasOperationPathChanged } from './helpers/hasOperationPathChanged.ts';
import { type ConnectionVariables, type ListingsData, type ListingsPropsInternal } from './types.ts';

const initialListingsData = {
  hasNextPage: true,
  listings: new Map(),
};

export const ConnectionListings = <Item extends PlainObject>(props: ListingsPropsInternal<Item>) => {
  const {
    batch,
    children,
    componentName,
    debug = false,
    execute,
    fragments,
    intersectionRoot = null,
    intersectionRootMargin = '0px',
    intersectionThreshold = 0,
    loading,
    queryHash,
    renderLoader,
    requestPath,
    result,
    resultsPerRequest = 20,
    tag,
    variables,
  } = props;

  const { data, operationId = '' } = result ?? {};
  const [{ hasNextPage, listings }, setListingsData] = useState<ListingsData<Item>>(initialListingsData);
  const [connectionVariables, setConnectionVariables] = useState<ConnectionVariables>({ first: resultsPerRequest });

  const [lastItemReference, isLastItemVisible] = useIntersectionObserver({
    root: intersectionRoot,
    rootMargin: intersectionRootMargin,
    threshold: intersectionThreshold,
  });

  const previousVariablesHashes = useRef<Map<string, string | undefined>>(new Map());
  const variablesHash = encode(JSON.stringify({ ...variables, requestPath }));

  const dependenciesKey = buildDependencyKey(
    operationId,
    // Typing get return value doesn't work very well
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    get(data, `${requestPath}.pageInfo.startCursor`) as string | null | undefined,
  );

  useEffect(() => {
    if (
      variablesHash !== previousVariablesHashes.current.get(queryHash) ||
      hasOperationPathChanged(requestPath, data)
    ) {
      const newConnectionVariables = { ...connectionVariables, after: undefined };

      void execute(
        {
          batch,
          fragments,
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
          ? new Map([...listings, [operationId, filteredData]])
          : new Map([[operationId, filteredData]]),
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
      hasOperationPathChanged(requestPath, data)) &&
    renderLoader
  ) {
    return renderLoader();
  }

  return children({
    hasNextPage,
    lastItemRef: lastItemReference,
    listings: formatListings<Item>(listings, requestPath),
    loading,
  });
};
