import { type PlainObject } from '@graphql-box/core';
import { get } from 'lodash-es';
import { type ConnectionResponse } from '../types.ts';

export const formatListings = <Item extends PlainObject>(
  listings: Map<string, ConnectionResponse<Item>>,
  requestPath: string
) =>
  [...listings].reduce((acc: Item[], [, data]) => {
    const requestPathData = get(data, requestPath);

    if (!requestPathData) {
      return acc;
    }

    const { edges } = requestPathData;

    if (!edges || edges.length === 0) {
      return acc;
    }

    return [...acc, ...edges.map(edge => edge.node)];
  }, []);
