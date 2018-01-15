import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import { execute, parse, subscribe } from "graphql";
import * as http from "http";
import { forAwaitEach, isAsyncIterable } from "iterall";
import * as WebSocket from "ws";
import graphqlSchema from "../schema";

export default function graphqlServer(): http.Server {
  const app = express();

  app.use(cors())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use("/graphql", async (req, res) => {
      try {
        const { query } = req.body;
        const result = await execute(graphqlSchema, parse(query));
        res.status(200).send(result);
      } catch (error) {
        res.status(500).send(error);
      }
    });

  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    ws.on("message", async (message) => {
      try {
        const { subscriptionID, subscription } = JSON.parse(message as string);
        const subscribeResult = await subscribe(graphqlSchema, parse(subscription));

        if (isAsyncIterable(subscribeResult)) {
          forAwaitEach(subscribeResult, (result) => {
            ws.send(JSON.stringify({ result, subscriptionID }));
          });
        } else {
          ws.send(JSON.stringify({ result: subscribeResult, subscriptionID }));
        }
      } catch (error) {
        ws.send(error);
      }
    });

    ws.on("error", (error) => {
      console.log(error); // tslint:disable-line
    });
  });

  wss.on("error", (error) => {
    console.log(error); // tslint:disable-line
  });

  server.listen(3001);

  server.on("error", (error) => {
    console.log(error); // tslint:disable-line
  });

  process.on("uncaughtException", (error) => {
    console.log(error); // tslint:disable-line
  });

  return server;
}
