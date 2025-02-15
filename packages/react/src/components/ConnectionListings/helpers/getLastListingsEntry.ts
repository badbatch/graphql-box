import { type PlainObject } from '@graphql-box/core';
import { type ConnectionResponse } from '#components/ConnectionListings/types.ts';

export const getLastListingsEntry = <Item extends PlainObject>(
  listings: Map<string, ConnectionResponse<Item>>,
): ConnectionResponse<Item> | undefined => [...listings][listings.size - 1]?.[1];
