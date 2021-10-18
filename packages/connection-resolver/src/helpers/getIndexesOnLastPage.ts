import getResultsOnLastPage, { Params } from "./getResultsOnLastPage";

export default ({ resultsPerPage, totalResults }: Params) => getResultsOnLastPage({ resultsPerPage, totalResults }) - 1;
