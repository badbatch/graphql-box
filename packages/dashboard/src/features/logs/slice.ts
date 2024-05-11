import { createAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { encode } from 'js-base64';
import { type LogEntry, type Store } from '../../types.ts';
import { websocketMessage } from '../websocket/slice.ts';

const logsAdapter = createEntityAdapter<LogEntry>();

export const logsSlice = createSlice({
  extraReducers: builder => {
    builder.addCase(websocketMessage, (state, action) => {
      const logEntry = {
        ...JSON.parse(action.payload),
        id: encode(action.payload),
      } as LogEntry;

      logsAdapter.setOne(state, logEntry);
    });
  },
  initialState: logsAdapter.getInitialState(),
  name: 'logs',
  reducers: {},
});

export const logsReceived = createAction<Record<string, LogEntry>>('logs/logsReceived');

const {
  selectAll: selectAllLogs,
  selectById: selectLogById,
  selectEntities: selectLogEntities,
  selectIds: selectLogIds,
  selectTotal: selectLogTotal,
} = logsAdapter.getSelectors<Store>(state => state.logs);

export { selectAllLogs, selectLogById, selectLogEntities, selectLogIds, selectLogTotal };
