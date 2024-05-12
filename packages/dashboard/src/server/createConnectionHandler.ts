import TailFile from '@logdna/tail-file';
import { existsSync } from 'node:fs';
import { type WebSocket } from 'ws';

export type Options = {
  filename: string;
};

export const createConnectionHandler =
  ({ filename }: Options) =>
  (ws: WebSocket) => {
    const tailFile = () => {
      const tail = new TailFile(filename, { encoding: 'utf8' });

      tail
        .on('data', (chunk: string) => {
          ws.send(chunk);
        })
        .on('tail_error', err => {
          console.error(`There was a problem tailing file: ${filename}`, err);
        })
        .start()
        .catch(error => {
          console.error('There was a problem starting the tail', error);
        });
    };

    ws.on('error', error => {
      console.error('There was a problem with the websocket', error);
    });

    if (existsSync(filename)) {
      tailFile();
    } else {
      setInterval(() => {
        if (existsSync(filename)) {
          tailFile();
        }
      }, 5000);
    }
  };
