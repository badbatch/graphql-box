import { coreDefs } from "@handl/core";

export interface IntrospectArgs {
  headers?: string[];
  output: string;
  schemaPath?: string;
  url?: string;
}

export interface IntrospectionResult {
  data?: coreDefs.PlainObjectMap;
  [key: string]: any;
}
