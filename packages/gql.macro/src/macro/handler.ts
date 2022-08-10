import { NodePath } from "@babel/core";
import { TemplateLiteral, stringLiteral } from "@babel/types";
import { hashRequest } from "@graphql-box/helpers";
import { MacroError, MacroHandler } from "babel-plugin-macros";
import { readFileSync } from "fs";
import { parse, resolve } from "path";
import writeFile from "../helpers/writeFile";

export type GqlConfig = {
  basePath?: string;
  requestWhitelistPath?: string;
};

const macroHandler: MacroHandler = ({ config, references: { default: paths }, state }) => {
  if (paths?.length) {
    const { cwd } = state;
    const { basePath = cwd, requestWhitelistPath = `${cwd}/requestWhitelist.txt` } = (config ?? {}) as GqlConfig;
    const whitelist: string[] = [];

    paths.forEach(path => {
      const targetPath = path.parentPath;

      if (targetPath.type === "TaggedTemplateExpression") {
        const quasiPath = (targetPath.get("quasi") as unknown) as NodePath<TemplateLiteral>;
        const gqlPath = quasiPath.evaluate().value as string;
        const fullGqlPath = resolve(basePath, gqlPath);
        let rawGql = readFileSync(fullGqlPath, { encoding: "utf8" });

        if (rawGql.startsWith("#import")) {
          const lines = rawGql.split("\n");
          const importLines = lines.filter(line => line.startsWith("#import"));
          const fragments: string[] = [];

          importLines.forEach(line => {
            const match = line.match(/#import "(.+)"/);

            if (match) {
              const { dir } = parse(fullGqlPath);
              const rawGqlFragment = readFileSync(resolve(dir, match[1]), { encoding: "utf8" });
              fragments.push(rawGqlFragment);
            }
          });

          lines.splice(0, importLines.length);
          rawGql = [...lines, ...fragments].join("\n");
        }

        whitelist.push(hashRequest(rawGql));
        targetPath.replaceWith(stringLiteral(rawGql));
      } else {
        throw new MacroError(
          `@graphql-box/gql.macro can only be used as tagged template expression. You tried ${targetPath.type}.`,
        );
      }
    });

    writeFile(requestWhitelistPath, whitelist);
  }
};

export default macroHandler;
