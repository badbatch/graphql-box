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
  RESOLVER_EXECUTED,
  RESOLVER_RESOLVED,
  SERVER_REQUEST_RECEIVED,
  SUBSCRIPTION_EXECUTED,
  SUBSCRIPTION_RESOLVED,
} from "@graphql-box/core";
import { Environment } from "../defs";

export const deriveLogOrder = (message: string) => {
  switch (message) {
    case REQUEST_EXECUTED:
    case SUBSCRIPTION_EXECUTED:
      return 1;

    case PENDING_QUERY_ADDED:
      return 2;

    case CACHE_ENTRY_QUERIED:
      return 3;

    case PARTIAL_QUERY_COMPILED:
      return 4;

    case FETCH_EXECUTED:
      return 5;

    case SERVER_REQUEST_RECEIVED:
      return 6;

    case EXECUTE_EXECUTED:
      return 7;

    case RESOLVER_EXECUTED:
      return 8;

    case RESOLVER_RESOLVED:
      return 9;

    case EXECUTE_RESOLVED:
    case FETCH_RESOLVED:
      return 10;

    case CACHE_ENTRY_ADDED:
      return 11;

    case PENDING_QUERY_RESOLVED:
      return 12;

    case REQUEST_RESOLVED:
    case SUBSCRIPTION_RESOLVED:
      return 13;

    default:
      return 0;
  }
};

export const deriveLogGroup = (environment: Environment, message: string) => {
  switch (true) {
    case environment === "workerClient" && deriveLogOrder(message) <= 5:
      return 1;

    case (environment === "client" || environment === "worker") && deriveLogOrder(message) <= 5:
      return 2;

    case environment === "server":
      return 3;

    case (environment === "client" || environment === "worker") && deriveLogOrder(message) > 5:
      return 4;

    case environment === "workerClient" && deriveLogOrder(message) > 5:
      return 5;

    default:
      return 0;
  }
};
