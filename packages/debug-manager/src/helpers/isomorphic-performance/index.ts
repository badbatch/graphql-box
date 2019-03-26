function isomorphicPerformance(): Performance {
  return typeof window !== "undefined" ? window.performance : require("perf_hooks").performance;
}

export default isomorphicPerformance();
