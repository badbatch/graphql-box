export interface UserOptions {
  /**
   * The WebSocket instance for managing a
   * WebSocket connection.
   */
  websocket: WebSocket;
}

export type InitOptions = UserOptions;

export type ConstructorOptions = UserOptions;
