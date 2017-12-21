import { expect } from "chai";
import { GraphQLSchema, IntrospectionQuery } from "graphql";
import * as introspectionQuery from "../introspection/index.json";
import createHandl from "../../src";
import Client from "../../src/client";
import WorkerClient from "../../src/worker-client";
import { ClientArgs } from "../../src/types";

const browserArgs: ClientArgs = {
  introspection: introspectionQuery as IntrospectionQuery,
  mode: "external",
  url: "https://api.github.com/graphql",
};

let graphqlSchema: GraphQLSchema | undefined;

if (!process.env.WEB_ENV) {
  graphqlSchema = require("../schema"); // tslint:disable-line
}

const serverArgs: ClientArgs = {
  mode: "internal",
  schema: graphqlSchema,
};

describe("the createHandl method", () => {
  if (process.env.WEB_ENV) {
    context("when the environment is a browser", () => {
      context("when the browser supports web workers", () => {
        it("the method should return an instance of the WorkerClient class", async () => {
          const workerClient = await createHandl(browserArgs) as WorkerClient;
          expect(workerClient).to.be.instanceof(WorkerClient);
          workerClient.terminate();
        });
      });

      context("when the browser does not support web workers", () => {
        it("the method should return an instance of the Client class", async () => {
          const client = await createHandl(browserArgs);
          expect(client).to.be.instanceof(Client);
        });
      });
    });
  } else {
    context("when the environment is a server", () => {
      it("the method should return an instance of the Client class", async () => {
        const client = await createHandl(serverArgs);
        expect(client).to.be.instanceof(Client);
      });
    });
  }
});
