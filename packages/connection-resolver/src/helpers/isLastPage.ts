export type Params = {
  page: number;
  totalPages: number;
};

export default ({ page, totalPages }: Params) => page === totalPages;
