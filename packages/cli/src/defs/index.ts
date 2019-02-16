import { PlainObjectMap } from "@handl/core";

export interface IntrospectArgs {
  headers?: string[];
  output: string;
  schemaPath?: string;
  url?: string;
}

export interface IntrospectionResult {
  data?: PlainObjectMap;
  [key: string]: any;
}
