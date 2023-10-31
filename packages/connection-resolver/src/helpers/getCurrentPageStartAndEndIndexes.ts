import { type Indexes } from '../types.ts';

export type StartIndexContext = {
  pageIndex: number;
  startIndex: Indexes;
};

export const getCurrentPageStartIndex = ({ pageIndex, startIndex }: StartIndexContext) =>
  pageIndex === 0 ? startIndex.relative : 0;

export type EndIndexContext = {
  endIndex: Indexes;
  pageIndex: number;
  resultsPerPage: number;
  totalCachedPages: number;
};

export const getCurrentPageEndIndex = ({ endIndex, pageIndex, resultsPerPage, totalCachedPages }: EndIndexContext) =>
  pageIndex === totalCachedPages - 1 ? endIndex.relative : resultsPerPage - 1;
