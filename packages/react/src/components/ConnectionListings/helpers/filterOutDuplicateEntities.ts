import { type PlainObject } from '@graphql-box/core';
import { get, set } from 'lodash-es';
import { type ConnectionResponse } from '#components/ConnectionListings/types.ts';

export const filterOutDuplicateEntities = <Item extends PlainObject>(
  prevData: ConnectionResponse<Item> | undefined,
  data: ConnectionResponse<Item>,
  requestPath: string,
  debug?: boolean,
): ConnectionResponse<Item> => {
  if (!prevData) {
    return data;
  }

  const prevRequestPathData = get(prevData, requestPath);

  if (!prevRequestPathData) {
    return data;
  }

  const { edges: prevEdges } = prevRequestPathData;

  if (!prevEdges) {
    return data;
  }

  // id is always going be either a string or a number
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const prevEdgeIds = new Set<string | number>(prevEdges.map(edge => edge.node.id as string | number));
  const requestPathData = get(data, requestPath);

  if (!requestPathData) {
    return data;
  }

  const { edges } = requestPathData;

  if (!edges) {
    return data;
  }

  const filteredEdges = edges.filter(edge => {
    // id is always going be either a string or a number
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    if (prevEdgeIds.has(edge.node.id as string | number)) {
      if (debug) {
        console.log(`ConnectionListings > Duplicate entity ${String(edge.node.id)} filtered out`, edge.node);
      }

      return false;
    }

    return true;
  });

  set(data, `${requestPath}.edges`, filteredEdges);
  return data;
};
