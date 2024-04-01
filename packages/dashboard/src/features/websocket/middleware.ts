import { type Middleware, type PayloadAction } from '@reduxjs/toolkit';
import {
  websocketClose,
  websocketClosed,
  websocketError,
  websocketMessage,
  websocketOpen,
  websocketSend,
} from './slice.ts';

// @ts-expect-error redux type is too generic
export const websocketMiddleware: Middleware = store => {
  const ws = new WebSocket(`ws://${window.location.host}/log`);

  ws.addEventListener('open', event => {
    store.dispatch(websocketOpen({ event, readyState: ws.readyState }));
  });

  ws.addEventListener('error', event => {
    store.dispatch(websocketError(event));
  });

  ws.addEventListener('close', event => {
    store.dispatch(websocketClosed({ event, readyState: ws.readyState }));
  });

  ws.addEventListener('message', (event: MessageEvent<string>) => {
    store.dispatch(websocketMessage(event.data));
  });

  return next => (action: PayloadAction<string>) => {
    switch (action.type) {
      case websocketClose.type: {
        ws.close();
        break;
      }

      case websocketSend.type: {
        ws.send(action.payload);
        break;
      }

      // no default
    }

    return next(action);
  };
};
