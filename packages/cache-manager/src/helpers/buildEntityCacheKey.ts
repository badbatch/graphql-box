export const buildEntityCacheKey = (typeName: string, idValue: unknown): string => `${typeName}:${String(idValue)}`;
