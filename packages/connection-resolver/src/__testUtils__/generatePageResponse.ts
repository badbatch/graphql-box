import { encode } from "js-base64";

export type Params = {
  resultsPerPage: number;
  totalPages: number;
  totalResults: number;
};

export default ({ resultsPerPage, totalPages, totalResults }: Params) => (page: number) => ({
  data: {
    page,
    results: Array.from({ length: resultsPerPage }, (_v, i) => i).map(index => {
      return { id: encode(`${index}::${page}`) };
    }),
    totalPages,
    totalResults,
  },
  headers: new Headers({ "Cache-Control": "max-age=60" }),
});
