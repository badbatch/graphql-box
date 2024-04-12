import { type RequestGroupField } from '../types.ts';

const fieldKeyWidths: Record<RequestGroupField, number> = {
  complexity: 7,
  depth: 7,
  duration: 7,
  error: 15,
  operation: 10,
  operationName: 10,
  origin: 10,
  timestamp: 11,
  variables: 10,
};

export const getFieldSummaryWidth = (fieldKey: RequestGroupField) => fieldKeyWidths[fieldKey];
