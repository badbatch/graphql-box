import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import { parse, subscribe } from "graphql";
import * as http from "http";
import { forAwaitEach, isAsyncIterable } from "iterall";
import * as WebSocket from "ws";
import { serverArgs } from "../helpers";
import graphqlSchema from "../schema";
import { ServerHandl } from "../../src/server";

export default async function graphqlServer(): Promise<http.Server> {
  const app = express();
  const handl = await ServerHandl.create(serverArgs);

  app.use(cors())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use("/graphql", handl.router());

  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    ws.on("message", async (message) => {
      try {
        const { subscriptionID, subscription } = JSON.parse(message as string);
        const subscribeResult = await subscribe(graphqlSchema, parse(subscription));

        if (isAsyncIterable(subscribeResult)) {
          forAwaitEach(subscribeResult, (result) => {
            if (ws.readyState === ws.OPEN) {
              ws.send(JSON.stringify({ result, subscriptionID }));
            }
          });
        } else if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({ result: subscribeResult, subscriptionID }));
        }
      } catch (error) {
        ws.send(error);
      }
    });

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
