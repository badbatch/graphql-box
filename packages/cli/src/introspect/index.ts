import { PlainObjectMap } from "@graphql-box/core";
import { outputFileSync } from "fs-extra";
import { ExecutionResult, execute, getIntrospectionQuery, parse } from "graphql";
import "isomorphic-fetch";
import { resolve } from "path";
import shell from "shelljs";
import yargs from "yargs";
import { IntrospectArgs } from "../defs";

export default async function introspect(): Promise<void> {
  const argv = yargs.option("headers", { type: "array" }).argv;
  const { headers, output, schemaPath, url } = (argv as unknown) as IntrospectArgs;
  let result: ExecutionResult | undefined;

  try {
    if (!schemaPath && !url) {
      const message = "introspect requires either the 'schemaPath' or 'url' argument, but got neither.";
      return Promise.reject(new TypeError(message));
    }

    if (!output) {
      return Promise.reject(new TypeError("introspect expected the 'output' argument."));
    }

    const rootDir = process.cwd();

    if (schemaPath) {
      shell.echo(">>>>>> introspect requiring schema");
      let schema = require(resolve(rootDir, schemaPath));
      if (schema.default) schema = schema.default;
      shell.echo(">>>>>> introspect executing introspection query against schema");
      result = (await execute({ document: parse(getIntrospectionQuery()), schema })) as ExecutionResult;
    } else if (url) {
      let headersObj: PlainObjectMap | undefined;

      if (headers) {
        shell.echo(">>>>>> introspect parsing headers");

        headersObj = headers.reduce((obj: PlainObjectMap, header: string) => {
          const [key, value] = header.split(":");
          if (key && value) obj[key] = value;
          return obj;
        }, {});
      }

      shell.echo(">>>>>> introspect making introspection query to url endpoint");

      const res = await fetch(url, {
        headers: new Headers(headersObj),
      });

      shell.echo(">>>>>> introspect parsing response of introspection query");
      result = await res.json();
    }

    if (!result) {
      return Promise.reject(new Error("introspect did not receive any data from the introspection query."));
    }

    const filePath = resolve(rootDir, output);
    shell.echo(">>>>>> introspect writing result of introspection query to disk");
    outputFileSync(filePath, JSON.stringify(result.data, null, 2), "utf8");
    shell.exit(0);
  } catch (error) {
    shell.echo(error);
    shell.exit(1);
  }
}
