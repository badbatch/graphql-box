import { appendFileSync } from 'node:fs';

export const writeFile = (requestWhitelistPath: string, whitelist: string[]) => {
  for (const entry of whitelist) {
    appendFileSync(requestWhitelistPath, `${entry}\n`);
  }
};
