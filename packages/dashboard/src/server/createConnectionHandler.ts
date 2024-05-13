import TailFile from '@logdna/tail-file';
import { existsSync } from 'node:fs';
import split2 from 'split2';
import { type WebSocket } from 'ws';

export type Options = {
  filename: string;
};

let position = 0;

export const createConnectionHandler =
  ({ filename }: Options) =>
  (ws: WebSocket) => {
    const tailFile = () => {
      const tail = new TailFile(filename, { encoding: 'utf8' });

      process.on('SIGINT', () => {
        tail
          .quit()
          .then(() => {
            console.log(`The last read file position was: ${position}`);
          })
          .catch(error => {
            process.nextTick(() => {
              console.error('Error during tailing file shutdown', error);
            });
          });
      });

      tail
        .on('flush', ({ lastReadPosition }) => {
          position = lastReadPosition;
        })
        .on('tail_error', err => {
          console.error(`There was a problem tailing file: ${filename}`, err);
        })
        .start()
        .catch(error => {
          console.error('There was a problem starting the tail', error);
        });

      let timeoutId: NodeJS.Timeout;
      const lines: string[] = [];

      // split2 typings include any
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      tail.pipe(split2()).on('data', (line: string) => {
        lines.push(line);
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
          ws.send(JSON.stringify(lines));
          lines.splice(0, lines.length);
        }, 5000);
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
