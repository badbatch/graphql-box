import { type BatchRequestData, type RequestData } from '../types.ts';

export const isRequestBatched = (body: RequestData | BatchRequestData): body is BatchRequestData => body.batched;
