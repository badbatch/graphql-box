import Client from "@graphql-box/client";
import { createContext } from "react";

export type GraphQLBoxContext = {
  graphqlBoxClient: Client;
};

const defaultValue = {};
export default createContext<GraphQLBoxContext>(defaultValue as GraphQLBoxContext);
