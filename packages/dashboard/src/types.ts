import { type LogLevel } from '@graphql-box/core';
import { type EntityState } from '@reduxjs/toolkit';
import { type OperationTypeNode } from 'graphql';
import { type JsonObject } from 'type-fest';

export type Env = {
  id: string;
  label: GraphqlEnv;
  logGroup: number;
  requestGroup: string;
  steps: string[];
  timestamp: string;
};

export type Error = {
  code: string;
  id: string;
  message: string;
  stack_trace: string; // eslint-disable-line camelcase
  type: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Filter = (store: Store, requestGroup: RequestGroup, configValue?: any) => boolean;

export type GraphqlEnv = 'client' | 'server' | 'worker' | 'workerClient';

export type GraphqlStep =
  | 'cache_entry_added'
  | 'cache_entry_queried'
  | 'execute_executed'
  | 'execute_resolved'
  | 'fetch_executed'
  | 'fetch_resolved'
  | 'partial_query_compiled'
  | 'pending_query_added'
  | 'pending_query_resolved'
  | 'request_executed'
  | 'request_resolved'
  | 'resolver_executed'
  | 'resolver_resolved'
  | 'server_request_received'
  | 'subscription_executed'
  | 'subscription_resolved';

export type LogEntry = {
  '@timestamp': string;
  ecs: {
    version: string;
  };
  error?: Error;
  id: string;
  labels: {
    cacheType: string;
    duration: number;
    endTime: number;
    environment: GraphqlEnv;
    hasDeferOrStream: boolean;
    logGroup: number;
    logOrder: number;
    nodeVersion?: string;
    operation: OperationTypeNode;
    operationName: string;
    osPlatform?: string;
    path?: string;
    port?: string;
    protocol?: string;
    queryFiltered: boolean;
    queryString?: string;
    request: string;
    requestComplexity?: number;
    requestDepth?: number;
    requestHash: string;
    requestID: string;
    result: string;
    returnCacheMetadata: boolean;
    startTime: number;
    url?: string;
    userAgent?: string;
    variables: JsonObject;
    whitelistHash: string;
  };
  log: {
    level: LogLevel;
    logger: string;
  };
  message: GraphqlStep;
};

export type LogEntryFlattened = {
  '@timestamp': string;
  'ecs.version': string;
  'error.code'?: string;
  'error.id'?: string;
  'error.message'?: string;
  'error.stack_trace'?: string;
  'error.type'?: string;
  'labels.cacheType': string;
  'labels.duration': number;
  'labels.endTime': number;
  'labels.environment': GraphqlEnv;
  'labels.hasDeferOrStream': boolean;
  'labels.logGroup': number;
  'labels.logOrder': number;
  'labels.nodeVersion'?: string;
  'labels.operation': OperationTypeNode;
  'labels.operationName': string;
  'labels.osPlatform'?: string;
  'labels.path'?: string;
  'labels.port'?: string;
  'labels.protocol'?: string;
  'labels.queryFiltered': boolean;
  'labels.queryString'?: string;
  'labels.request': string;
  'labels.requestComplexity'?: string;
  'labels.requestDepth'?: string;
  'labels.requestHash': string;
  'labels.requestID': string;
  'labels.result': string;
  'labels.returnCacheMetadata': boolean;
  'labels.startTime': number;
  'labels.url'?: string;
  'labels.userAgent'?: string;
  'labels.variables': string;
  'labels.whitelistHash': string;
  'log.level': LogLevel;
  'log.logger': string;
  message: GraphqlStep;
};

export enum ReadyState {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}

export type RequestGroupField =
  | 'complexity'
  | 'depth'
  | 'duration'
  | 'error'
  | 'operation'
  | 'operationName'
  | 'timestamp'
  | 'origin'
  | 'variables';

export type RequestGroup = {
  envs: string[];
  id: string;
  timestamp: string;
};

export type Step = {
  entries: string[];
  env: GraphqlEnv;
  id: string;
  label: GraphqlStep;
  logGroup: number;
  logOrder: number;
  requestGroup: string;
  timestamp: string;
};

export type Store = {
  envs: EntityState<Env, string>;
  logs: EntityState<LogEntry, string>;
  requestGroups: EntityState<RequestGroup, string>;
  steps: EntityState<Step, string>;
  ui: Ui;
  websocket: {
    lastError: Event | undefined;
    lastEvent: Event | undefined;
    readyState: ReadyState;
  };
};

export type SyntaxLang = 'javascript' | 'graphql' | 'json';

export type Ui = {
  logEntryModal: string;
  requestDiffModal: [string, string, string] | [];
  requestVersionDialog: string;
};
