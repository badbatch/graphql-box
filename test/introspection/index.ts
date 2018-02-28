import { writeFileSync } from "fs";
import { execute, introspectionQuery, parse } from "graphql";
import { resolve } from "path";
import schema from "../schema";

(async function generateIntrospection() {
  const result = await execute(schema, parse(introspectionQuery));
  const filePath = resolve(__dirname, "tesco/index.json");
  writeFileSync(filePath, JSON.stringify(result.data), "utf8");
}());
