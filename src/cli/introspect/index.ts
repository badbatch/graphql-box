import * as fs from "fs";
import { execute, introspectionQuery, parse } from "graphql";
import "isomorphic-fetch";
import * as path from "path";
import * as yargs from "yargs";
import { ObjectMap } from "../../types";

function mkdirSyncRec(filePath: string): void {
  const parsed = path.parse(filePath);
  const dirPaths = parsed.dir.split(path.sep);

  dirPaths.reduce((existingPath, dirPath) => {
    const newPath = !existingPath ? dirPath : `${existingPath}${path.sep}${dirPath}`;
    if (!fs.existsSync(newPath)) fs.mkdirSync(newPath);
    return newPath;
  }, "");
}

const argv = yargs.option("headers", { type: "array" }).argv;
const rootDir = process.cwd();

if (argv.tsconfig) {
  const tsConfig = require(path.resolve(rootDir, argv.tsconfig));
  require("ts-node").register(tsConfig);
}

try {
  (async function introspect(): Promise<void> {
    let result: {
      data?: ObjectMap;
      [key: string]: any;
    } | undefined;

    if (!argv.schema && !argv.url) {
      const message = "Introspect requires either the 'schema' or 'url' argument, but not neither.";
      return Promise.reject(new TypeError(message));
    }

    if (!argv.output) {
      return Promise.reject(new TypeError("Introspect expected the 'output' argument."));
    }

    try {
      if (argv.schema) {
        let schema = require(path.resolve(rootDir, argv.schema));
        if (schema.default) schema = schema.default;
        result = await execute(schema, parse(introspectionQuery));
      } else if (argv.url) {
        let headers: ObjectMap | undefined;

        if (argv.headers) {
          headers = argv.headers.reduce((newHeaders: ObjectMap, header: string) => {
            const [key, value] = header.split(":");
            if (key && value) newHeaders[key] = value;
            return newHeaders;
          }, {});
        }

        const res = await fetch(argv.url, {
          headers: new Headers(headers),
        });

        result = await res.json();
      }

      if (!result) {
        return Promise.reject(new Error("Introspect did not receive any data from the query."));
      }

      const filePath = path.resolve(rootDir, argv.output);
      mkdirSyncRec(filePath);
      fs.writeFileSync(filePath, JSON.stringify(result.data), "utf8");
    } catch (error) {
      return Promise.reject(error);
    }
  }());
} catch (error) {
  console.log(error); // tslint:disable-line
}
