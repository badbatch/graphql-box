import { type BatchedLogDataPayload, type LogDataPayload } from '../types.ts';

export const isLogBatched = (body: LogDataPayload | BatchedLogDataPayload): body is BatchedLogDataPayload =>
  body.batched;
