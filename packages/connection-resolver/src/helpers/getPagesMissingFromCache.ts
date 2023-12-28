import { type CachedEdges } from '../types.ts';

export const getPagesMissingFromCache = (cachedEdgesByPage: CachedEdges[]) => {
  return cachedEdgesByPage.reduce<number[]>((missing, cachedEdgesPage) => {
    if (cachedEdgesPage.edges.length === 0) {
      missing.push(cachedEdgesPage.pageNumber);
    }

    return missing;
  }, []);
};
