import { appendFileSync } from "fs";

export default (requestWhitelistPath: string, whitelist: string[]) => {
  whitelist.forEach(entry => {
    appendFileSync(requestWhitelistPath, entry);
  });
};
