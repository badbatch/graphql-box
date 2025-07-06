import { type PathPart } from '#types.ts';

export const getPathParts = (path: string): PathPart[] => {
  const pathParts: PathPart[] = [];
  const entries = path.split(/{(\d)}\./);

  for (const [index, part] of entries.entries()) {
    if (/^\d$/.test(part)) {
      continue;
    }

    const nextEntry = entries[index + 1];

    if (!nextEntry || !/^\d$/.test(nextEntry)) {
      pathParts.push(part);
      continue;
    }

    pathParts.push([part, Number(nextEntry)]);
  }

  return pathParts;
};
