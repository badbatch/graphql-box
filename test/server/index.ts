import * as bodyParser from "body-parser";
import * as express from "express";
import { execute, parse, subscribe } from "graphql";
import * as http from "http";
import { forAwaitEach } from "iterall";
import * as WebSocket from "ws";
import graphqlSchema from "../schema";

export default function graphqlServer(): http.Server {
  const app = express();

  app.use("/graphql", bodyParser.json(), async (req, res) => {
    const { query } = req.body;
    const result = await execute(graphqlSchema, parse(query));
    res.status(200).send(result);
  });

  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    ws.on("message", async (message) => {
      const { subscriptionID, subscription } = JSON.parse(message as string);
      const asyncIterator = await subscribe(graphqlSchema, parse(subscription));

      forAwaitEach(asyncIterator, (result) => {
        ws.send(JSON.stringify({ result, subscriptionID }));
      });
    });
  });

  server.listen(3001);
  return server;
}