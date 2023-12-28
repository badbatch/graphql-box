import { type Client } from '@graphql-box/client';
import { type WorkerClient } from '@graphql-box/worker-client';
import { type ReactNode } from 'react';
import { Context } from './Context.ts';

export type Props = {
  children: ReactNode;
  graphqlBoxClient: Client | WorkerClient;
};

export const Providewr = ({ children, graphqlBoxClient }: Props) => (
  <Context.Provider value={{ graphqlBoxClient }}>{children}</Context.Provider>
);
