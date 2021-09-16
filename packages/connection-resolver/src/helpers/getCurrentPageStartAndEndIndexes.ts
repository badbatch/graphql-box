export type StartIndexContext = {
  pageIndex: number;
  startIndex: number;
};

export const getCurrentPageStartIndex = ({ pageIndex, startIndex }: StartIndexContext) =>
  pageIndex === 0 ? startIndex : 0;

export type EndIndexContext = {
  endIndex: number;
  pageIndex: number;
  resultsPerPage: number;
  totalCachedPages: number;
};

export const getCurrentPageEndIndex = ({ endIndex, pageIndex, resultsPerPage, totalCachedPages }: EndIndexContext) => {
  if (pageIndex === totalCachedPages - 1 || endIndex <= resultsPerPage - 1) {
    return endIndex;
  }

  return resultsPerPage - 1;
};
