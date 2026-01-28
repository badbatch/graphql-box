import { type ImportOptions } from '@cachemap/core';
import { type ReactNode, useContext, useRef } from 'react';
import { Context } from './Context.ts';

export type GraphqlBoxUpdateProviderProps = {
  children: ReactNode;
  imports: ImportOptions[];
};

export const GraphqlBoxUpdateProvider = ({ children, imports }: GraphqlBoxUpdateProviderProps) => {
  const { graphqlBoxClient } = useContext(Context);
  const promiseRef = useRef<Promise<void> | undefined>(undefined);
  const doneRef = useRef(false);
  const { cache } = graphqlBoxClient;

  if (!cache) {
    return children;
  }

  if (!doneRef.current) {
    promiseRef.current ??= Promise.all(imports.map(options => cache.import(options))).then(() => {
      doneRef.current = true;
    });

    // throwing promises in render method is React pattern for async rendering
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw promiseRef.current;
  }

  return children;
};
