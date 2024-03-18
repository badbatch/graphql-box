import { type PlainArray } from '@graphql-box/core';

export type RequestMissingPagesParams = {
  count: number;
  direction: 'forward' | 'backward';
  page: number;
  results: number;
  resultsPerPage: number;
  totalPages: number;
  totalResults: number;
};

export type RequestMissingPagesCallback = (params: { nextPage: number }) => Promise<unknown>;

export const requestOutstandingPages = async (
  { count, direction, page, results, resultsPerPage, totalPages, totalResults }: RequestMissingPagesParams,
  requestCallback: RequestMissingPagesCallback
) => {
  const resultsOnLastPage = totalResults % totalPages;
  const outstanding = count - results;
  let toRequest: number;

  if (direction === 'forward') {
    toRequest = Math.ceil(outstanding / resultsPerPage);
  } else {
    if (page === totalPages) {
      toRequest = count <= resultsOnLastPage ? 1 : Math.ceil(count - resultsOnLastPage / resultsPerPage) + 1;
    } else {
      toRequest = Math.ceil(outstanding / resultsPerPage);
    }
  }

  const promises: Promise<unknown>[] = [];

  for (let index = 0; index < toRequest; index += 1) {
    promises.push(requestCallback({ nextPage: direction === 'forward' ? page + index : page - index }));
  }

  const missingPages: number[] = [];
  const settledResults = await Promise.allSettled(promises);

  const pageResults = settledResults.reduce<PlainArray>((pages, result, index) => {
    if (result.status === 'fulfilled') {
      pages.push(result.value);
    }

    if (result.status === 'rejected') {
      missingPages.push(direction === 'forward' ? page + index : page - index);
    }

    return pages;
  }, []);

  return {
    missingPages,
    pageResults,
  };
};
