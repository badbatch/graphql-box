import { type NodePath } from '@babel/core';
import { type TemplateLiteral, stringLiteral } from '@babel/types';
import { MacroError, type MacroHandler } from 'babel-plugin-macros';
import { readFileSync } from 'node:fs';
import { parse, resolve } from 'node:path';
import { hashRequest } from './helpers/hashRequest.ts';
import { resolveImports } from './helpers/resolveImports.ts';
import { writeFile } from './helpers/writeFile.ts';

export type GqlConfig = {
  basePath?: string;
  requestWhitelistPath?: string;
};

export const macroHandler: MacroHandler = ({ config, references: { default: paths }, state }) => {
  if (paths.length > 0) {
    const { cwd } = state;
    // Unable to type the config in a better way
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const { basePath = cwd, requestWhitelistPath = `${cwd}/.gql-query-whitelist` } = (config ?? {}) as GqlConfig;
    const whitelist: string[] = [];

    for (const path of paths) {
      const targetPath = path.parentPath;

      if (targetPath?.type === 'TaggedTemplateExpression') {
        // Proving too much hassle to type any other way
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const quasiPath = targetPath.get('quasi') as unknown as NodePath<TemplateLiteral>;
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const gqlPath = quasiPath.evaluate().value as string;
        const fullGqlPath = resolve(basePath, gqlPath);
        const { dir } = parse(fullGqlPath);
        const rawGql = resolveImports(readFileSync(fullGqlPath, { encoding: 'utf8' }), dir);
        whitelist.push(hashRequest(rawGql));
        targetPath.replaceWith(stringLiteral(rawGql));
      } else {
        throw new MacroError(
          `@graphql-box/gql.macro can only be used as tagged template expression. You tried ${
            targetPath?.type ?? 'a unknown'
          } target path.`,
        );
      }
    }

    writeFile(requestWhitelistPath, whitelist);
  }
};
