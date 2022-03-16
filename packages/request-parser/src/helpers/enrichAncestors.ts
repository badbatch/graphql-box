export default (ancestors: readonly any[], key: string | number) => {
  const last = ancestors[ancestors.length - 1];
  return [...ancestors, last.selections, last.selections[key]];
};
