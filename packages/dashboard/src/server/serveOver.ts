import { type Express } from 'express';
import { createServer as createHttpServer } from 'node:http';
import { createServer as createHttpsServer } from 'node:https';

export type Options = {
  ca?: string;
  cert?: string;
  https?: boolean;
  key?: string;
  port: number;
};

export const serveOver = (app: Express, options: Options) => {
  const { https, port, ...otherOptions } = options;
  const server = https ? createHttpsServer(otherOptions, app) : createHttpServer(app);

  server.listen(port, () => {
    console.log(`Server listening on port ${port} (over ${https ? 'HTTPS' : 'HTTP'})`);

    process.on('SIGINT', () => {
      server.close(err => {
        process.exit(err ? 1 : 0);
      });
    });
  });

  return server;
};
