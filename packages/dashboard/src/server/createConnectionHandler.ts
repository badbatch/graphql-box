import TailFile from '@logdna/tail-file';
import { existsSync } from 'node:fs';
import split2 from 'split2';
import { type WebSocket } from 'ws';

export type Options = {
  filename: string;
};

export const createConnectionHandler =
  ({ filename }: Options) =>
  (ws: WebSocket) => {
    const tailFile = () => {
      const tail = new TailFile(filename);

      tail
        .on('tail_error', err => {
          console.error(`There was a problem tailing file: ${filename}`, err);
        })
        .start()
        .catch(error => {
          console.error('There was a problem starting the tail', error);
        });

      // split2 typings include any
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      tail.pipe(split2()).on('data', (line: string) => {
        ws.send(line);
      });

      let timeoutId: NodeJS.Timeout;
      const logEntries: string[] = [];

      tail.on('line', (logEntry: string) => {
        logEntries.push(logEntry);

        if (ws.readyState === ws.OPEN) {
          clearTimeout(timeoutId);

          timeoutId = setTimeout(() => {
            ws.send(JSON.stringify(logEntries));
            logEntries.splice(0, logEntries.length);
          }, 5000);
        }
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
