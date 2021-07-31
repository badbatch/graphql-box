import { Edge } from "../defs";

export type Params = {
  edges: Edge[];
  endCursor: string;
  page: number;
  resultsPerPage: number;
  startCursor: string;
  totalPages: number;
  totalResults: number;
};

export default ({ edges, endCursor, page, resultsPerPage, startCursor, totalPages, totalResults }: Params) => {
  const startCursorIndex = edges.findIndex(({ cursor }) => cursor === startCursor);
  const endCursorIndex = edges.findIndex(({ cursor }) => cursor === endCursor);

  const indexesPerPage = resultsPerPage - 1;
  const resultsOnLastPage = totalResults % totalPages;
  const indexesOnLastPage = resultsOnLastPage === 0 ? indexesPerPage : resultsOnLastPage - 1;

  return {
    hasNextPage: page < totalPages || endCursorIndex < indexesOnLastPage,
    hasPreviousPage: page > 1 || startCursorIndex > 0,
  };
};
