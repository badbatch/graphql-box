export type Params = {
  page: number;
  totalPages: number;
};

export const isLastPage = ({ page, totalPages }: Params) => page === totalPages;
