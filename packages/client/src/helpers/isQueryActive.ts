import { type RequestData } from '@graphql-box/core';
import { type ActiveQueryData } from '../types.ts';

export const isQueryActive = (activeRequestsList: ActiveQueryData[], requestData: RequestData) =>
  activeRequestsList.some(({ requestData: activeRequestData }) => activeRequestData.hash === requestData.hash);
