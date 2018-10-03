import { coreDefs } from "@handl/core";
import { DocumentNode, IntrospectionQuery } from "graphql";

/**
 * Base options.
 */
export interface BaseOptions {
  /**
   * Output of an introspection query.
   */
  introspection: IntrospectionQuery;
}

export interface UpdateQueryResult {
  ast: DocumentNode;
  errors: Error[];
  query: string;
}

export interface RequestParser {
  updateQuery(
    query: string,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<UpdateQueryResult>;
}

export type RequestParserInit = (options: { typeIDKey?: string; }) => RequestParser;
