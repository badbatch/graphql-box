import { type PlainObject } from '@graphql-box/core';
import { QueryError } from '@graphql-box/helpers';
import { encode } from 'js-base64';
import { ConnectionListings } from '#components/ConnectionListings/ConnectionListings.tsx';
import { type ConnectionResponse, type ListingsProps } from '#components/ConnectionListings/types.ts';
import { useQuery } from '#hooks/useQuery.ts';

export const ConnectionListingsWrapper = <Item extends PlainObject>(props: ListingsProps<Item>) => {
  const { query, renderError, ...rest } = props;

  const { execute, loading, result } = useQuery<ConnectionResponse<Item>>(query, {
    loading: true,
  });

  if (result instanceof QueryError) {
    return renderError?.(result);
  }

  return <ConnectionListings {...rest} execute={execute} loading={loading} queryHash={encode(query)} result={result} />;
};
