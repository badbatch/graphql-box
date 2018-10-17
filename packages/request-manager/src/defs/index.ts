import { coreDefs } from "@handl/core";

/**
 * Base options.
 */
export interface BaseOptions {
  /**
   * Whether a client should batch query and mutation
   * requests.
   */
  batch?: boolean;

  /**
   * How long handl should wait for a server to
   * respond before timing out.
   */
  fetchTimeout?: number;

  /**
   * Additional headers to be sent with every request.
   */
  headers?: coreDefs.PlainObjectMap;

  /**
   * The endpoint that handl will use to communicate with the
   * GraphQL server for queries and mutations.
   */
  url: string;
}

export interface RequestManager {
  fetch(requestData: coreDefs.RequestData): Promise<coreDefs.RawResponseData>;
}

export type RequestManagerInit = () => RequestManager;
