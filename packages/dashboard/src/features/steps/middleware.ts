import { createListenerMiddleware } from '@reduxjs/toolkit';
import { type Store } from '../../types.ts';
import { logsReceived } from '../logs/slice.ts';
import { stepsCreated } from './slice.ts';

const listenerMiddleware = createListenerMiddleware<Store>();

listenerMiddleware.startListening({
  actionCreator: logsReceived,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(stepsCreated(listenerApi.getState().steps.entities));
  },
});

export const stepsMiddleware = listenerMiddleware.middleware;
