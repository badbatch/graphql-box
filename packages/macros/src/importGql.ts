import { readFileSync } from 'node:fs';
import { isAbsolute, parse, resolve } from 'node:path';
import { resolveImports } from '#helpers/resolveImports.ts';

export const importGql = (gqlPath: string): string => {
  const fullGqlPath = isAbsolute(gqlPath) ? gqlPath : resolve(process.cwd(), gqlPath);
  const { dir } = parse(fullGqlPath);
  return resolveImports(readFileSync(fullGqlPath, { encoding: 'utf8' }), dir);
};
