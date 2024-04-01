import { type PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { ReadyState } from '../../types.ts';

export type WebsocketState = {
  lastError: Event | undefined;
  lastEvent: Event | undefined;
  readyState: ReadyState;
};

export const websocketSlice = createSlice({
  initialState: {
    lastError: undefined,
    lastEvent: undefined,
    readyState: ReadyState.CLOSED,
  } as WebsocketState,
  name: 'websocket',
  reducers: {
    websocketClosed: (state, action: PayloadAction<{ event: CloseEvent; readyState: ReadyState }>) => {
      state.readyState = action.payload.readyState;
      state.lastEvent = action.payload.event;
    },
    websocketError: (state, action: PayloadAction<Event>) => {
      state.lastError = action.payload;
    },
    websocketOpen: (state, action: PayloadAction<{ event: Event; readyState: ReadyState }>) => {
      state.readyState = action.payload.readyState;
      state.lastEvent = action.payload.event;
    },
  },
});

export const { websocketClosed, websocketError, websocketOpen } = websocketSlice.actions;

export const websocketMessage = createAction<string>('websocket/websocketMessage');

export const websocketSend = createAction<string>('websocket/websocketSend');

export const websocketClose = createAction('websocket/websocketClose');
