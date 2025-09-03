import { type PathPart } from '#types.ts';

export const explodePathPart = (pathPart: [part: string, count: number], prefixes?: string[]): string[] => {
  const exploded: string[] = [];
  const [part, count] = pathPart;

  for (const [index] of Array.from({ length: count }).entries()) {
    const path = `${part}[${String(index)}]`;

    if (prefixes?.length) {
      exploded.push(...prefixes.map(prefix => `${prefix}.${path}`));
    } else {
      exploded.push(path);
    }
  }

  return exploded;
};

export const explodePathParts = (pathParts: PathPart[]): string[] => {
  let exploded: string[] = [];

  for (const pathPart of pathParts) {
    if (Array.isArray(pathPart)) {
      exploded = explodePathPart(pathPart, exploded);
    } else if (exploded.length > 0) {
      exploded = exploded.map(path => `${path}.${pathPart}`);
    } else {
      exploded.push(pathPart);
    }
  }

  return exploded;
};
