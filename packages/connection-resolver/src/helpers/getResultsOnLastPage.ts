export type Params = {
  resultsPerPage: number;
  totalResults: number;
};

export const getResultsOnLastPage = ({ resultsPerPage, totalResults }: Params) => {
  const remainder = totalResults % resultsPerPage;
  return remainder === 0 ? resultsPerPage : remainder;
};
