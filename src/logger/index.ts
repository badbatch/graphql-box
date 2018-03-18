import { Logger } from "iso-logger";

let level: string;

if (process.env.DEBUG) {
  level = "debug";
} else if (process.env.NODE_ENV === "production") {
  level = "warn";
} else {
  level = "info";
}

export default new Logger({ consoleOptions: { level }, winstonOptions: { level } });
