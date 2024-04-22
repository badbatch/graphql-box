import { existsSync } from 'node:fs';
import { Tail } from 'tail';
import { type WebSocket } from 'ws';

export type Options = {
  filename: string;
};

export const createConnectionHandler =
  ({ filename }: Options) =>
  (ws: WebSocket) => {
    const tailFile = () => {
      const tail = new Tail(filename, { fromBeginning: true });
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

      tail.on('error', error => {
        console.log(error);
      });
    };

    ws.on('error', error => {
      console.error(error);
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
