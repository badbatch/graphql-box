import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import next from 'next';
import { type NextServer } from 'next/dist/server/next.js';
import { WebSocketServer } from 'ws';
import { createConnectionHandler } from './createConnectionHandler.ts';
import { serveOver } from './serveOver.ts';

const { CA, CERT, HTTPS, LOG_TAIL_PATH, NODE_ENV, PORT } = process.env;
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

const server = serveOver(expressApp, { ca: CA, cert: CERT, https: HTTPS === 'true', port });
const wss = new WebSocketServer({ path: '/log', server });
const connectionHandler = createConnectionHandler({ filename: LOG_TAIL_PATH });
wss.on('connection', connectionHandler);

wss.on('error', error => {
  console.error(error);
});
