import {
  CACHE_ENTRY_ADDED,
  CACHE_ENTRY_QUERIED,
  EXECUTE_EXECUTED,
  EXECUTE_RESOLVED,
  FETCH_EXECUTED,
  FETCH_RESOLVED,
  PARTIAL_QUERY_COMPILED,
  PENDING_QUERY_ADDED,
  PENDING_QUERY_RESOLVED,
  REQUEST_EXECUTED,
  REQUEST_RESOLVED,
  SUBSCRIPTION_EXECUTED,
  SUBSCRIPTION_RESOLVED,
} from "@graphql-box/core";
import { Environment } from "../defs";

export const deriveLogOrder = (event: string | symbol) => {
  switch (event) {
    case REQUEST_EXECUTED:
    case SUBSCRIPTION_EXECUTED:
      return 1;

    case PENDING_QUERY_ADDED:
      return 2;

    case CACHE_ENTRY_QUERIED:
      return 3;

    case PARTIAL_QUERY_COMPILED:
      return 4;

    case EXECUTE_EXECUTED:
    case FETCH_EXECUTED:
      return 5;

    case EXECUTE_RESOLVED:
    case FETCH_RESOLVED:
      return 6;

    case CACHE_ENTRY_ADDED:
      return 7;

    case PENDING_QUERY_RESOLVED:
      return 8;

    case REQUEST_RESOLVED:
    case SUBSCRIPTION_RESOLVED:
      return 9;

    default:
      return 0;
  }
};

export const deriveLogGroup = (environment: Environment) => {
  switch (environment) {
    case "server":
      return 3;

    case "workerClient":
      return 1;

    default:
      return 2;
  }
};
