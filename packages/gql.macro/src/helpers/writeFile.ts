import { appendFileSync } from "fs";

export default (requestWhitelistPath: string, whitelist: string[]) => {
  appendFileSync(requestWhitelistPath, whitelist.join("\n"));
};
