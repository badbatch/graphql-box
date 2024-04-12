export const deriveVisibleIndexRange = (pageNumber: number, perPage: number) => {
  const max = pageNumber * perPage;
  const min = max - perPage;
  const startIndex = min === 0 ? 0 : min - 1;
  return [startIndex, max];
};
