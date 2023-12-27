import { type PlainData } from '@graphql-box/core';

export type FetchMockMethods = 'calls' | 'resetHistory' | 'restore';

export interface FetchMockMessageRequest {
  messageID: number;
  method: FetchMockMethods;
  options: FetchMockPostMessageOptions;
  type: string;
}

export interface FetchMockPostMessageOptions {
  returnValue?: boolean;
}

export interface FetchMockMessageResponse {
  messageID: number;
  result: PlainData;
  type: string;
}

export interface MockRequestOptions {
  data: PlainData;
  hash?: string;
}

export type PendingResolver = (value: unknown) => void;

export interface PendingData {
  resolve: PendingResolver;
}

export type PendingTracker = Map<number, PendingData>;
