import { type BatchedLogData, type LogData } from '../types.ts';

export const isLogBatched = (body: LogData | BatchedLogData): body is BatchedLogData => body.batched;
