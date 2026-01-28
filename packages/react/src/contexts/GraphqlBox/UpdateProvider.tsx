import { type ImportOptions } from '@cachemap/core';
import { type ReactNode, useContext, useEffect, useState } from 'react';
import { Context } from './Context.ts';

export type GraphqlBoxUpdateProviderProps = {
  children: ReactNode;
  fallback?: ReactNode | ReactNode[];
  imports: ImportOptions[];
};

export const GraphqlBoxUpdateProvider = ({ children, fallback, imports }: GraphqlBoxUpdateProviderProps) => {
  const { graphqlBoxClient } = useContext(Context);
  const [imported, setImported] = useState<boolean>(false);
  const { cache } = graphqlBoxClient;

  useEffect(() => {
    const importCacheExport = async () => {
      if (cache) {
        await Promise.all(imports.map(options => cache.import(options)));
        setImported(true);
      }
    };

    if (!imported) {
      void importCacheExport();
    }

    // We only want to re-execute when the data below changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imported, !!cache, imports.length]);

  return imported ? children : fallback;
};
