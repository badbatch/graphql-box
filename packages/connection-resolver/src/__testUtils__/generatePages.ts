import { range } from "lodash";

export default (pageRanges: string[]) =>
  pageRanges.reduce((pages, pageRange) => {
    const [start, end] = pageRange.split("-");

    if (!end) {
      return [...pages, Number(start)];
    }

    return [...pages, ...range(Number(start), Number(end)), Number(end)];
  }, [] as number[]);
