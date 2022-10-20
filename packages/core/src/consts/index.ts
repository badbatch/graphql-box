export const DEFAULT_TYPE_ID_KEY = "id";
export const TYPE_NAME_KEY = "__typename";

export const MUTATION = "mutation";
export const QUERY = "query";
export const SUBSCRIPTION = "subscription";

export const DEFER = "defer" as const;
export const STREAM = "stream" as const;
export const INCLUDE = "include" as const;
export const SKIP = "skip" as const;

export const DATA_ENTITIES = "dataEntities";
export const QUERY_RESPONSES = "queryResponses";
export const REQUEST_FIELD_PATHS = "requestFieldPaths";

export const CACHE_ENTRY_ADDED = "cache_entry_added";
export const CACHE_ENTRY_QUERIED = "cache_entry_queried";
export const EXECUTE_EXECUTED = "execute_executed";
export const EXECUTE_RESOLVED = "execute_resolved";
export const FETCH_EXECUTED = "fetch_executed";
export const FETCH_RESOLVED = "fetch_resolved";
export const PARTIAL_QUERY_COMPILED = "partial_query_compiled";
export const PENDING_QUERY_ADDED = "pending_query_added";
export const PENDING_QUERY_RESOLVED = "pending_query_resolved";
export const REQUEST_EXECUTED = "request_executed";
export const REQUEST_RESOLVED = "request_resolved";
export const RESOLVER_EXECUTED = "resolver_executed";
export const RESOLVER_RESOLVED = "resolver_resolved";
export const SUBSCRIPTION_EXECUTED = "subscription_executed";
export const SUBSCRIPTION_RESOLVED = "subscription_resolved";
