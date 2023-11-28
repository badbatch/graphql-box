import { readFileSync } from 'node:fs';
import { parse, resolve } from 'node:path';

export const resolveImports = (rawGql: string, parentDir: string) => {
  if (rawGql.startsWith('#import')) {
    const lines = rawGql.split('\n');
    const importLines = lines.filter(line => line.startsWith('#import'));
    const fragments: string[] = [];

    for (const line of importLines) {
      const match = line.match(/#import "(.+)"/);
      const path = match?.[1];

      if (path) {
        const fullGqlPath = resolve(parentDir, path);
        const { dir } = parse(fullGqlPath);
        const rawGqlFragment = resolveImports(readFileSync(fullGqlPath, { encoding: 'utf8' }), dir);
        fragments.push(rawGqlFragment);
      }
    }

    lines.splice(0, importLines.length);
    rawGql = [...lines, ...fragments].join('\n');
  }

  return rawGql;
};
