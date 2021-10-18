export type RequestMissingPagesParams = {
  count: number;
  direction: "forward" | "backward";
  page: number;
  results: number;
  resultsPerPage: number;
  totalPages: number;
  totalResults: number;
};

export type RequestMissingPagesCallback = (params: { nextPage: number }) => Promise<any>;

export default async (
  { count, direction, page, results, resultsPerPage, totalPages, totalResults }: RequestMissingPagesParams,
  requestCallback: RequestMissingPagesCallback,
) => {
  const resultsOnLastPage = totalResults % totalPages;
  const outstanding = count - results;
  let toRequest: number;

  if (direction === "forward") {
    toRequest = Math.ceil(outstanding / resultsPerPage);
  } else {
    if (page === totalPages) {
      if (count <= resultsOnLastPage) {
        toRequest = 1;
      } else {
        toRequest = Math.ceil(count - resultsOnLastPage / resultsPerPage) + 1;
      }
    } else {
      toRequest = Math.ceil(outstanding / resultsPerPage);
    }
  }

  const promises = [];

  for (let i = 0; i < toRequest; i += 1) {
    promises.push(requestCallback({ nextPage: direction === "forward" ? page + i : page - i }));
  }

  const missingPages: number[] = [];

  const pageResults = (await Promise.allSettled(promises)).reduce((pages, { status, ...rest }, i) => {
    if (status === "fulfilled") {
      pages.push((rest as { value: any }).value);
    }

    if (status === "rejected") {
      missingPages.push(direction === "forward" ? page + i : page - i);
    }

    return pages;
  }, [] as any[]);

  return {
    missingPages,
    pageResults,
  };
};
