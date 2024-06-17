import { type Client } from '@graphql-box/client';
import { type WorkerClient } from '@graphql-box/worker-client';
import { type ReactNode, useEffect, useState } from 'react';
import { type RequireAtLeastOne } from 'type-fest';
import { Context } from './Context.ts';

export type GraphqlBoxProviderProps = {
  children: ReactNode;
  /**
   * Use instead of passing the client in on graphqlBoxClient
   * if you need to lazy initialise the client because it is using
   * browser APIs only available in client-only components.
   */
  createGraphqlBoxClient?: () => Client | WorkerClient;
  graphqlBoxClient?: Client | WorkerClient;
};

export const GraphqlBoxProvider = ({
  children,
  createGraphqlBoxClient,
  graphqlBoxClient,
}: RequireAtLeastOne<GraphqlBoxProviderProps, 'createGraphqlBoxClient' | 'graphqlBoxClient'>) => {
  const [client, setClient] = useState<Client | WorkerClient | undefined>(graphqlBoxClient);

  useEffect(() => {
    if (createGraphqlBoxClient) {
      setClient(createGraphqlBoxClient());
    }
  }, [createGraphqlBoxClient]);

  return client ? <Context.Provider value={{ graphqlBoxClient: client }}>{children}</Context.Provider> : undefined;
};
