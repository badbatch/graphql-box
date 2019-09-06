import { PlainObjectMap } from "@graphql-box/core";

export interface IntrospectArgs {
  headers?: string[];
  output: string;
  schemaPath?: string;
  url?: string;
}

export interface IntrospectionResult {
  data?: PlainObjectMap | null;
}
