/* tslint:disable:no-console */

import map from "@cachemap/map";
import HandlServer from "@handl/server";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import http from "http";
import sinon from "sinon";
import WebSocket from "ws";
import initServer from "../helpers/init-server";

global.Date.now = sinon.stub().returns(Date.parse("June 6, 1979"));

export default async function graphqlServer(): Promise<http.Server> {
  const handlServer = await HandlServer.init({
    client: await initServer({
      cachemapStore: map(),
      typeCacheDirectives: {
        Email: "public, max-age=5",
        Inbox: "public, max-age=1",
      },
    }),
  });

  const app = express();

  app
    .use(cors())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use("/graphql", handlServer.request({ awaitDataCaching: true, returnCacheMetadata: true }));

  const server = http.createServer(app);
  const wss = new WebSocket.Server({ path: "/graphql", server });

  wss.on("connection", (ws) => {
    ws.on("message", handlServer.message({ awaitDataCaching: true, returnCacheMetadata: true, ws }));

    ws.on("error", (error) => {
      console.log(error);
    });
  });

  wss.on("error", (error) => {
    console.log(error);
  });

  server.listen(3001, () => {
    console.log("Server listening on port 3001...");
  });

  server.on("error", (error) => {
    console.log(error);
  });

  process.on("uncaughtException", (error) => {
    console.log(error);
  });

  return server;
}
