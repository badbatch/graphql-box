import { init as map } from '@cachemap/map';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import http from 'node:http';
import { WebSocketServer } from 'ws';
import { initServerClient } from '../helpers/initServerClient.ts';
import { ExpressMiddleware } from '@graphql-box/server/express';
import { WebsocketMiddleware } from '@graphql-box/server/ws';

globalThis.Date.now = () => Date.parse('June 6, 1979 GMT');

export const start = (): http.Server => {
  const expressMiddleware = new ExpressMiddleware({
    client: initServerClient({
      cachemapStore: map(),
      typeCacheDirectives: {
        Email: 'public, max-age=5',
        Inbox: 'public, max-age=1',
      },
    }),
  });

  const websocketMiddleware = new WebsocketMiddleware({
    client: initServerClient({
      cachemapStore: map(),
      typeCacheDirectives: {
        Email: 'public, max-age=5',
        Inbox: 'public, max-age=1',
      },
    }),
  });

  const app = express();

  app
    .use(cors())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use('/graphql', expressMiddleware.createRequestHandler({ awaitDataCaching: true, returnCacheMetadata: true }));

  const httpServer = http.createServer(app);
  const wss = new WebSocketServer({ path: '/graphql', server: httpServer });

  wss.on('connection', ws => {
    ws.on(
      'message',
      websocketMiddleware.createMessageHandler({ awaitDataCaching: true, returnCacheMetadata: true, ws })
    );

    ws.on('error', error => {
      console.log(error);
    });
  });

  wss.on('error', error => {
    console.log(error);
  });

  httpServer.listen(3001, () => {
    console.log('Server listening on port 3001...');
  });

  httpServer.on('error', error => {
    console.log(error);
  });

  process.on('uncaughtException', error => {
    console.log(error);
  });

  return httpServer;
};
