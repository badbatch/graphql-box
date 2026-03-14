import { GRAPHQL_BOX } from '../constants.ts';
import { type MessageRequestPayload } from '../types.ts';

export const isGraphqlBoxMessageRequestPayload = (payload: unknown): payload is MessageRequestPayload =>
  !!payload && typeof payload === 'object' && 'type' in payload && payload.type === GRAPHQL_BOX;
