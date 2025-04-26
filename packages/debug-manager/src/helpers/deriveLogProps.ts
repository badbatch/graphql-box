import {
  CACHE_ENTRY_ADDED,
  CACHE_ENTRY_QUERIED,
  EXECUTE_EXECUTED,
  EXECUTE_RESOLVED,
  FETCH_EXECUTED,
  FETCH_RESOLVED,
  type GraphqlEnv,
  type GraphqlStep,
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
} from '@graphql-box/core';

export const deriveLogOrder = (message: GraphqlStep): number => {
  switch (message) {
    case SERVER_REQUEST_RECEIVED: {
      return 1;
    }

    case REQUEST_EXECUTED: {
      return 2;
    }

    case SUBSCRIPTION_EXECUTED: {
      return 2;
    }

    case PENDING_QUERY_ADDED: {
      return 3;
    }

    case CACHE_ENTRY_QUERIED: {
      return 4;
    }

    case PARTIAL_QUERY_COMPILED: {
      return 5;
    }

    case FETCH_EXECUTED: {
      return 6;
    }

    case EXECUTE_EXECUTED: {
      return 6;
    }

    case RESOLVER_EXECUTED: {
      return 7;
    }

    case RESOLVER_RESOLVED: {
      return 8;
    }

    case EXECUTE_RESOLVED: {
      return 9;
    }

    case FETCH_RESOLVED: {
      return 9;
    }

    case CACHE_ENTRY_ADDED: {
      return 10;
    }

    case PENDING_QUERY_RESOLVED: {
      return 11;
    }

    case REQUEST_RESOLVED: {
      return 12;
    }

    case SUBSCRIPTION_RESOLVED: {
      return 12;
    }

    default: {
      return 0;
    }
  }
};

export const deriveLogGroup = (environment: GraphqlEnv, message: GraphqlStep): number => {
  switch (true) {
    case environment === 'workerClient' && deriveLogOrder(message) <= 6: {
      return 1;
    }

    case (environment === 'client' || environment === 'worker') && deriveLogOrder(message) <= 6: {
      return 2;
    }

    case environment === 'server': {
      return 3;
    }

    case (environment === 'client' || environment === 'worker') && deriveLogOrder(message) > 6: {
      return 4;
    }

    case environment === 'workerClient' && deriveLogOrder(message) > 6: {
      return 5;
    }

    default: {
      return 0;
    }
  }
};
