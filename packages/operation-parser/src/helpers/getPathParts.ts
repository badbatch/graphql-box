import { type PathPart } from '#types.ts';

export const getPathParts = (path: string): PathPart[] => {
  const pathParts: PathPart[] = [];
  const entries = path.split(/{([0-9]+)}\./);

  for (const [index, part] of entries.entries()) {
    if (/^[0-9]+$/.test(part)) {
      continue;
    }

    const nextEntry = entries[index + 1];

    if (!nextEntry || !/^[0-9]+$/.test(nextEntry)) {
      pathParts.push(part);
      continue;
    }

    pathParts.push([part, Number(nextEntry)]);
  }

  return pathParts;
};
