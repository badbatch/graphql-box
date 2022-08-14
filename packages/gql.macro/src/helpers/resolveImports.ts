import { readFileSync } from "fs";
import { parse, resolve } from "path";

const resolveImports = (rawGql: string, parentDir: string) => {
  if (rawGql.startsWith("#import")) {
    const lines = rawGql.split("\n");
    const importLines = lines.filter(line => line.startsWith("#import"));
    const fragments: string[] = [];

    importLines.forEach(line => {
      const match = line.match(/#import "(.+)"/);

      if (match) {
        const fullGqlPath = resolve(parentDir, match[1]);
        const { dir } = parse(fullGqlPath);
        const rawGqlFragment = resolveImports(readFileSync(fullGqlPath, { encoding: "utf8" }), dir);
        fragments.push(rawGqlFragment);
      }
    });

    lines.splice(0, importLines.length);
    rawGql = [...lines, ...fragments].join("\n");
  }

  return rawGql;
};

export default resolveImports;
