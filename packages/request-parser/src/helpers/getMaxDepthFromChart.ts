export default (depthChart: Record<string, number>) =>
  Object.keys(depthChart).reduce((acc, key) => (depthChart[key] > acc ? depthChart[key] : acc), 0);
