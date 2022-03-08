import { writeFileSync } from "fs";

export default (requestWhitelistPath: string, whitelist: string[]) => {
  try {
    const existingWhitelist: string[] = require(requestWhitelistPath);
    writeFileSync(requestWhitelistPath, JSON.stringify([...new Set([...existingWhitelist, ...whitelist])], null, 2));
  } catch {
    writeFileSync(requestWhitelistPath, JSON.stringify([...new Set(whitelist)], null, 2));
  }
};
