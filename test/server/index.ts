import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as http from "http";
import * as WebSocket from "ws";
import { serverArgs } from "../helpers";
import { ServerHandl } from "../../src";

export default async function graphqlServer(): Promise<http.Server> {
  const app = express();
  const handl = await ServerHandl.create(serverArgs);

  app.use(cors())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use("/graphql", handl.request());

  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    ws.on("message", handl.message(ws));

    ws.on("error", (error) => {
      // no catch
    });
  });

  wss.on("error", (error) => {
    // no catch
  });

  server.listen(3001);

  server.on("error", (error) => {
    // no catch
  });

  process.on("uncaughtException", (error) => {
    // no catch
  });

  return server;
}
