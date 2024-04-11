import { type EntityState, configureStore } from '@reduxjs/toolkit';
import { envsMiddleware } from './features/envs/middleware.ts';
import { envsSlice } from './features/envs/slice.ts';
import { logsMiddleware } from './features/logs/middleware.ts';
import { logsSlice } from './features/logs/slice.ts';
import { requestGroupsSlice } from './features/requestGroups/slice.ts';
import { stepsMiddleware } from './features/steps/middleware.ts';
import { stepsSlice } from './features/steps/slice.ts';
import { uiSlice } from './features/ui/slice.ts';
import { websocketMiddleware } from './features/websocket/middleware.ts';
import { websocketSlice } from './features/websocket/slice.ts';
import { type LogEntry, type Store } from './types.ts';

export type CreateStoreOptions = {
  preloadedState?: {
    logs: EntityState<LogEntry, string>;
  };
};

export const createStore = (options: CreateStoreOptions = {}) =>
  configureStore<Store>({
    // @ts-expect-error TODO: Need to look into this
    middleware: getDefaultMiddleware => [
      ...getDefaultMiddleware(),
      websocketMiddleware,
      logsMiddleware,
      stepsMiddleware,
      envsMiddleware,
    ],
    reducer: {
      envs: envsSlice.reducer,
      logs: logsSlice.reducer,
      requestGroups: requestGroupsSlice.reducer,
      steps: stepsSlice.reducer,
      ui: uiSlice.reducer,
      websocket: websocketSlice.reducer,
    },
    ...options,
  });
