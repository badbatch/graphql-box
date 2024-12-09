import { type PostMessage as CachemapMessageRequestPayload } from '@cachemap/core-worker';
import { GRAPHQL_BOX } from '../constants.ts';
import { type MessageRequestPayload } from '../types.ts';

export const isGraphqlBoxMessageRequestPayload = (
  payload: MessageRequestPayload | CachemapMessageRequestPayload,
): payload is MessageRequestPayload => payload.type === GRAPHQL_BOX;
