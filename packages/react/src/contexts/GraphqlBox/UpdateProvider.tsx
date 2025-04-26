import { type Core, type ImportOptions } from '@cachemap/core';
import { WorkerClient } from '@graphql-box/worker-client';
import { type ReactNode, useContext } from 'react';
import { Context } from './Context.ts';

export type GraphqlBoxUpdateProviderProps = {
  children: ReactNode;
  imports: ImportOptions[];
};

export const GraphqlBoxUpdateProvider = ({ children, imports }: GraphqlBoxUpdateProviderProps) => {
  const { graphqlBoxClient } = useContext(Context);
  let cache: Core | undefined;

  if (graphqlBoxClient instanceof WorkerClient) {
    ({ cache } = graphqlBoxClient.cacheManager);
  }

  for (const options of imports) {
    void graphqlBoxClient.cache?.import(options);

    if (cache) {
      void cache.import(options);
    }
  }

  return children;
};
