import { createListenerMiddleware } from '@reduxjs/toolkit';
import { type Store } from '../../types.ts';
import { stepsCreated } from '../steps/slice.ts';
import { envsCreated } from './slice.ts';

const listenerMiddleware = createListenerMiddleware<Store>();

listenerMiddleware.startListening({
  actionCreator: stepsCreated,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(envsCreated(listenerApi.getState().envs.entities));
  },
});

export const envsMiddleware = listenerMiddleware.middleware;
