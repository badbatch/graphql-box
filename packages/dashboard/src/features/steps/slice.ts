import { createAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { encode } from 'js-base64';
import { type Step, type Store } from '../../types.ts';
import { logsReceived } from '../logs/slice.ts';
import { sortEntries } from './helpers.ts';

const stepsAdapter = createEntityAdapter<Step>();

export const stepsSlice = createSlice({
  extraReducers: builder => {
    builder.addCase(logsReceived, (state, action) => {
      const steps = Object.keys(action.payload).reduce((acc: Record<string, Step>, key) => {
        const logEntry = action.payload[key];

        if (!logEntry) {
          return acc;
        }

        const id = encode(`${logEntry.labels.requestID}::${logEntry.labels.logGroup}::${logEntry.labels.logOrder}`);

        const step = acc[id] ?? {
          entries: [],
          env: logEntry.labels.environment,
          id,
          label: logEntry.message,
          logGroup: logEntry.labels.logGroup,
          logOrder: logEntry.labels.logOrder,
          requestGroup: logEntry.labels.requestID,
          timestamp: '',
        };

        step.entries.push(logEntry.id);
        step.entries.sort(sortEntries(action.payload));
        step.timestamp = step.entries[0] ? action.payload[step.entries[0]]?.['@timestamp'] ?? '' : '';
        acc[id] = step;
        return acc;
      }, {});

      stepsAdapter.upsertMany(state, steps);
    });
  },
  initialState: stepsAdapter.getInitialState(),
  name: 'steps',
  reducers: {},
});

export const stepsCreated = createAction<Record<string, Step>>('steps/stepsCreated');

const {
  selectAll: selectAllSteps,
  selectById: selectStepById,
  selectEntities: selectStepEntities,
  selectIds: selectStepIds,
  selectTotal: selectStepTotal,
} = stepsAdapter.getSelectors<Store>(state => state.steps);

export { selectAllSteps, selectStepById, selectStepEntities, selectStepIds, selectStepTotal };
