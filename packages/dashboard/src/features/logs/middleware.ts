import { createListenerMiddleware } from '@reduxjs/toolkit';
import { type Store } from '../../types.ts';
import { websocketMessage } from '../websocket/slice.ts';
import { logsReceived } from './slice.ts';

const listenerMiddleware = createListenerMiddleware<Store>();

listenerMiddleware.startListening({
  actionCreator: websocketMessage,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(logsReceived(listenerApi.getState().logs.entities));
  },
});

export const logsMiddleware = listenerMiddleware.middleware;
