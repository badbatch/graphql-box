declare namespace NodeJS {
  interface ProcessEnv {
    readonly HTTPS: 'true' | 'false';
    readonly LOG_TAIL_PATH: string;
    readonly NODE_SSL_CA?: string;
    readonly NODE_SSL_CERT?: string;
    readonly NODE_SSL_KEY?: string;
    readonly PORT?: string;
  }
}
