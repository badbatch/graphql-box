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

export interface UpdateRequestResult {
  ast: DocumentNode;
  errors: Error[];
  request: string;
}

export interface RequestParser {
  updateRequest(
    request: string,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<UpdateRequestResult>;
}

export type RequestParserInit = (options: { typeIDKey?: string; }) => RequestParser;
