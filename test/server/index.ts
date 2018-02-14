import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import { execute, ExecutionResult, parse, subscribe } from "graphql";
import * as http from "http";
import { forAwaitEach, isAsyncIterable } from "iterall";
import * as WebSocket from "ws";
import graphqlSchema from "../schema";
import { StringObjectMap } from "../../src/types";

export interface ExecutionResultObjectMap {
  [key: string]: ExecutionResult;
}

export default function graphqlServer(): http.Server {
  const app = express();

  app.use(cors())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use("/graphql", async (req, res) => {
      try {
        const { batch, query } = req.body;
        let result: ExecutionResult | ExecutionResultObjectMap;

        if (batch) {
          const requests = query as StringObjectMap;
          const responses: ExecutionResultObjectMap = {};

          await Promise.all(Object.keys(requests).map(async (requestHash) => {
            const request = requests[requestHash];
            responses[requestHash] = await execute(graphqlSchema, parse(request));
          }));

          result = responses;
        } else {
          result = await execute(graphqlSchema, parse(query));
        }

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
