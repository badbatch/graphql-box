import Client from "@graphql-box/client";
import WorkerClient from "@graphql-box/worker-client";
import { createContext } from "react";

export type GraphQLBoxContext = {
  graphqlBoxClient: Client | WorkerClient;
};

const defaultValue = {};
export default createContext<GraphQLBoxContext>(defaultValue as GraphQLBoxContext);
