import { type Client } from '@graphql-box/client';
import { type WorkerClient } from '@graphql-box/worker-client';
import { createContext } from 'react';

export type GraphQLBoxContext = {
  graphqlBoxClient: Client | WorkerClient;
};

const defaultValue = {};
export const Context = createContext<GraphQLBoxContext>(defaultValue as GraphQLBoxContext);
