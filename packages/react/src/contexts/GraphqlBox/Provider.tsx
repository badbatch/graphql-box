'use client';

import { type Client } from '@graphql-box/client';
import { type WorkerClient } from '@graphql-box/worker-client';
import { type ReactNode } from 'react';
import { Context } from './Context.ts';

export type GraphqlBoxProviderProps = {
  children: ReactNode;
  graphqlBoxClient: Client | WorkerClient;
};

export const GraphqlBoxProvider = ({ children, graphqlBoxClient }: GraphqlBoxProviderProps) => (
  <Context.Provider value={{ graphqlBoxClient }}>{children}</Context.Provider>
);
