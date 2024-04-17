import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import next from 'next';
import { type NextServer } from 'next/dist/server/next.js';
import http from 'node:http';
import { resolve } from 'node:path';
import { WebSocketServer } from 'ws';
import { handleConnectionMessage } from './middleware/handleConnectionMessage.ts';

const { LOG_FILE_PATH = 'logs/app.log', NODE_ENV, PORT } = process.env;
const port = PORT ? Number.parseInt(PORT, 10) : 3000;
const dev = NODE_ENV !== 'production';
// @ts-expect-error nextjs types are not being picked up correctly
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const nextServer = next({ dev }) as NextServer;
const handle = nextServer.getRequestHandler();
await nextServer.prepare();

const expressApp = express();
expressApp.use(cookieParser());
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));

expressApp.all('*', (req, res) => {
  void handle(req, res);
});

const httpServer = http.createServer(expressApp);

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port} (over HTTP)`);
});

const wss = new WebSocketServer({ path: '/log', server: httpServer });

wss.on('connection', ws => {
  handleConnectionMessage(ws, { filename: resolve(process.cwd(), LOG_FILE_PATH) });

  ws.on('error', error => {
    console.error(error);
  });
});

wss.on('error', error => {
  console.error(error);
});
