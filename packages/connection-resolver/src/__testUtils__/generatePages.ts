import { range } from 'lodash-es';

export const generatePages = (pageRanges: string[]) =>
  pageRanges.reduce<number[]>((pages, pageRange) => {
    const [start, end] = pageRange.split('-');

    if (!end) {
      return [...pages, Number(start)];
    }

    return [...pages, ...range(Number(start), Number(end)), Number(end)];
  }, []);
