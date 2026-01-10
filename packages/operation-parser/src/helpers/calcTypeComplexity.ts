export const calcTypeComplexity = (
  typeOccurrences: Record<string, number>,
  typeComplexityMap: Record<string, number>,
): number => {
  return Object.entries(typeOccurrences).reduce((complexity, [typeName, count]) => {
    const typeComplexity = typeComplexityMap[typeName] ?? 0;
    return complexity + typeComplexity * count;
  }, 0);
};
