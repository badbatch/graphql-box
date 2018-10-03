export interface PlainObjectMap {
  [key: string]: any;
}

export interface PlainObjectStringMap {
  [key: string]: string;
}

export interface RequestOptions {
  /**
   * Whether the request method should wait until
   * all response data has been cached before
   * returning the response data.
   */
  awaitDataCaching?: boolean;

  /**
   * A list of query fragements to be inserted
   * into the main query, mutation or subscription
   * being requested.
   */
  fragments?: string[];

  /**
   * An identifier that will be stored in a request's cache metadata.
   * This can be used to retrieve cache entries against.
   */
  tag?: any;

  /**
   * Arguments to be inserted into the query, mutation or
   * subscription being requested.
   */
  variables?: PlainObjectMap;
}

export type CacheTypes = "responses" | "queryPaths" | "dataEntities";

export interface FieldTypeInfo {
  hasArguments: boolean;
  hasDirectives: boolean;
  isEntity: boolean;
  typeIDValue?: string | number;
  typeName: string;
}

export type FieldTypeMap = Map<string, FieldTypeInfo>;

export type ValidOperation = "mutation" | "query" | "subscription";

export interface RequestContext {
  cache?: CacheTypes;
  fieldTypeMap: FieldTypeMap;
  handlID: string;
  operation: ValidOperation;
  operationName: string;
}
