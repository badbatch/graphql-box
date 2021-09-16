import { range } from "lodash";

export default (pageRanges: string[]) =>
  pageRanges.reduce((pages, pageRange) => {
    const [start, end] = pageRange.split("-");
    return [...pages, ...range(Number(start), Number(end)), Number(end)];
  }, [] as number[]);
