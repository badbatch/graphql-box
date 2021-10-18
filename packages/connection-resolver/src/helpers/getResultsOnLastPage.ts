export type Params = {
  resultsPerPage: number;
  totalResults: number;
};

export default ({ resultsPerPage, totalResults }: Params) => {
  const remainder = totalResults % resultsPerPage;
  return remainder === 0 ? resultsPerPage : remainder;
};
