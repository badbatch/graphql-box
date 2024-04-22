declare namespace NodeJS {
  interface ProcessEnv {
    readonly CA?: string;
    readonly CERT?: string;
    readonly HTTPS: 'true' | 'false';
    readonly LOG_TAIL_PATH: string;
    readonly PORT?: string;
  }
}
