export const calcTypeComplexity = (fieldTypeList: string[], typeComplexityMap: Record<string, number>): number => {
  return fieldTypeList.reduce((complexity: number, name) => {
    const typeComplexity = typeComplexityMap[name];
    return typeComplexity ? complexity + typeComplexity : complexity;
  }, 0);
};
