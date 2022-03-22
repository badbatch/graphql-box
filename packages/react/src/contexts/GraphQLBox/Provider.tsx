import Client from "@graphql-box/client";
import WorkerClient from "@graphql-box/worker-client";
import React, { ReactChild } from "react";
import Context from "./Context";

export type Props = {
  children: ReactChild;
  graphqlBoxClient: Client | WorkerClient;
};

export default ({ children, graphqlBoxClient }: Props) => (
  <Context.Provider value={{ graphqlBoxClient }}>{children}</Context.Provider>
);
