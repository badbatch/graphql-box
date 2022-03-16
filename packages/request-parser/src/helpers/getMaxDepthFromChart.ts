import { keys } from "lodash";

export default (depthChart: Record<string, number>) =>
  keys(depthChart).reduce((acc, key) => (depthChart[key] > acc ? depthChart[key] : acc), 0);
