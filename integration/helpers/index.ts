export const defaultOptions = { awaitDataCaching: true, returnCacheMetadata: true };

export function log(...args: any[]): void {
  console.log(...args); // tslint:disable-line:no-console
}

export function onWebsocketOpen(websocket: WebSocket): Promise<void> {
  return new Promise((resolve) => {
    websocket.onopen = () => {
      resolve();
    };
  });
}
