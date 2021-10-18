import { CachedEdges } from "../defs";

export default (cachedEdgesByPage: CachedEdges[]) => {
  return cachedEdgesByPage.reduce((missing, cachedEdgesPage) => {
    if (!cachedEdgesPage.edges.length) {
      missing.push(cachedEdgesPage.pageNumber);
    }

    return missing;
  }, [] as number[]);
};
