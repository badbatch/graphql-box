'use client';

import { type ImportOptions } from '@cachemap/core';
import { type ReactNode, useContext } from 'react';
import { Context } from './Context.ts';

export type GraphqlBoxUpdateProviderProps = {
  children: ReactNode;
  imports: ImportOptions[];
};

export const GraphqlBoxUpdateProvider = ({ children, imports }: GraphqlBoxUpdateProviderProps) => {
  const { graphqlBoxClient } = useContext(Context);

  for (const options of imports) {
    void graphqlBoxClient.cache?.import(options);
  }

  return children;
};
