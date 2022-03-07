/* tslint:disable:no-console */

import map from "@cachemap/map";
import BoxServer from "@graphql-box/server";
import { json, urlencoded } from "body-parser";
import cors from "cors";
import express from "express";
import http from "http";
import sinon from "sinon";
import WebSocket from "ws";
import initServer from "../helpers/init-server";

global.Date.now = sinon.stub().returns(Date.parse("June 6, 1979 GMT"));

export default function graphqlServer(): http.Server {
  const boxServer = new BoxServer({
    client: initServer({
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
    .use(urlencoded({ extended: true }))
    .use(json())
    .use("/graphql", boxServer.request({ awaitDataCaching: true, returnCacheMetadata: true }));

  const server = http.createServer(app);
  const wss = new WebSocket.Server({ path: "/graphql", server });

  wss.on("connection", ws => {
    ws.on("message", boxServer.message({ awaitDataCaching: true, returnCacheMetadata: true, ws }));

    ws.on("error", error => {
      console.log(error);
    });
  });

  wss.on("error", error => {
    console.log(error);
  });

  server.listen(3001, () => {
    console.log("Server listening on port 3001...");
  });

  server.on("error", error => {
    console.log(error);
  });

  process.on("uncaughtException", error => {
    console.log(error);
  });

  return server;
}
