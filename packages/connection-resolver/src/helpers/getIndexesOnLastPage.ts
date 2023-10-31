import { type Params, getResultsOnLastPage } from './getResultsOnLastPage.ts';

export const getIndexesOnLastPage = ({ resultsPerPage, totalResults }: Params) =>
  getResultsOnLastPage({ resultsPerPage, totalResults }) - 1;
