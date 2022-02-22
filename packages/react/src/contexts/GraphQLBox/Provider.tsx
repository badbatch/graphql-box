import Client from "@graphql-box/client";
import React, { ReactChild } from "react";
import Context from "./Context";

export type Props = {
  children: ReactChild;
  graphqlBoxClient: Client;
};

export default ({ children, graphqlBoxClient }: Props) => (
  <Context.Provider value={{ graphqlBoxClient }}>{children}</Context.Provider>
);
