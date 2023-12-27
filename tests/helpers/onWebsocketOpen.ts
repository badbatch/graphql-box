export const onWebsocketOpen = (websocket: WebSocket): Promise<void> => {
  return new Promise(resolve => {
    websocket.addEventListener('open', () => {
      resolve();
    });
  });
};
