import { NodePath } from "@babel/core";
import { TemplateLiteral, stringLiteral } from "@babel/types";
import { hashRequest } from "@graphql-box/helpers";
import { MacroError, MacroHandler } from "babel-plugin-macros";
import { readFileSync } from "fs";
import { resolve } from "path";
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
        const rawGql = readFileSync(resolve(basePath, gqlPath), { encoding: "utf8" });
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
