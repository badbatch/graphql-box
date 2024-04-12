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
} from '@graphql-box/core';
import { Paper, Typography } from '@mui/material';
import { get, isArray } from 'lodash-es';
import { useDispatch, useSelector } from 'react-redux';
import { selectLogById } from '../../features/logs/slice.ts';
import { logEntryModal } from '../../features/ui/slice.ts';
import { type LogEntry, type Store } from '../../types.ts';
import { SyntaxHighlight } from '../SyntaxHighlight/index.tsx';
import { type LogEntryBriefProps } from './types.ts';

const defaultPropKeys = ['message'];

const propKeyMap = {
  [CACHE_ENTRY_ADDED]: [
    ...defaultPropKeys,
    'labels.cacheType',
    'labels.decryptedCacheKey',
    [
      'labels.requestHash',
      (result: unknown, logEntry: LogEntry) => (logEntry.labels.cacheType === 'dataEntities' ? result : undefined),
    ],
  ],
  [CACHE_ENTRY_QUERIED]: [
    ...defaultPropKeys,
    'labels.cacheType',
    'labels.decryptedCacheKey',
    [
      'labels.requestHash',
      (result: unknown, logEntry: LogEntry) => (logEntry.labels.cacheType === 'dataEntities' ? result : undefined),
    ],
  ],
  [EXECUTE_EXECUTED]: defaultPropKeys,
  [EXECUTE_RESOLVED]: [
    ...defaultPropKeys,
    ['labels.duration', (result: number) => `${Math.round(result * 100) / 100}ms`],
  ],
  [FETCH_EXECUTED]: defaultPropKeys,
  [FETCH_RESOLVED]: [
    ...defaultPropKeys,
    ['labels.duration', (result: number) => `${Math.round(result * 100) / 100}ms`],
  ],
  [PARTIAL_QUERY_COMPILED]: defaultPropKeys,
  [PENDING_QUERY_ADDED]: defaultPropKeys,
  [PENDING_QUERY_RESOLVED]: defaultPropKeys,
  [REQUEST_EXECUTED]: defaultPropKeys,
  [REQUEST_RESOLVED]: [
    ...defaultPropKeys,
    ['labels.duration', (result: number) => `${Math.round(result * 100) / 100}ms`],
  ],
  [RESOLVER_EXECUTED]: [
    ...defaultPropKeys,
    [
      'labels.url',
      (result: string) => {
        const url = new URL(result);
        const queryParams = [...url.searchParams.entries()].filter(([name]) => name !== 'api_key');
        const queryString = queryParams.length > 0 ? `?${new URLSearchParams(queryParams).toString()}` : '';
        return `${url.pathname}${queryString}`;
      },
    ],
  ],
  [RESOLVER_RESOLVED]: [
    ...defaultPropKeys,
    [
      'labels.url',
      (result: string) => {
        const url = new URL(result);
        const queryParams = [...url.searchParams.entries()].filter(([name]) => name !== 'api_key');
        const queryString = queryParams.length > 0 ? `?${new URLSearchParams(queryParams).toString()}` : '';
        return `${url.pathname}${queryString}`;
      },
    ],
  ],
  [SERVER_REQUEST_RECEIVED]: defaultPropKeys,
  [SUBSCRIPTION_EXECUTED]: defaultPropKeys,
  [SUBSCRIPTION_RESOLVED]: defaultPropKeys,
};

export const LogEntryBrief = ({ logId }: LogEntryBriefProps) => {
  const logEntry = useSelector((state: Store) => selectLogById(state, logId));
  const dispatch = useDispatch();

  if (!logEntry) {
    return null;
  }

  const propKeys = propKeyMap[logEntry.message];

  let propValues = propKeys.map(entry => {
    const key = (isArray(entry) ? entry[0] : entry) as string;
    // TODO: Fix this
    const value = get(logEntry, key);
    return isArray(entry) ? (entry[1] as (value: unknown, logEntry: LogEntry) => string)(value, logEntry) : value;
  });

  if (propValues.includes(undefined)) {
    propValues = propValues.filter(value => value !== undefined);
  }

  return (
    <Paper
      elevation={1}
      onClick={() => dispatch(logEntryModal(logId))}
      sx={{
        backgroundColor: '#fff',
        cursor: 'pointer',
        minHeight: '4.9rem',
        padding: '0.2rem 0.6rem',
        position: 'relative',
      }}
      variant="elevation"
    >
      {propValues.map(propValue => (
        <SyntaxHighlight
          code={JSON.stringify(propValue)}
          language="javascript"
          size="sm"
          styleOverrides={{ backgroundColor: '#fff' }}
        />
      ))}
      <Typography sx={{ bottom: 0, fontSize: '0.6rem', position: 'absolute', right: '0.5rem' }} variant="caption">
        {`env: ${logEntry.labels.environment === 'workerClient' ? 'client' : logEntry.labels.environment}`}
      </Typography>
    </Paper>
  );
};
