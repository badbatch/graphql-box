import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { castArray, isUndefined } from 'lodash-es';
import { type JsonObject, type JsonValue } from 'type-fest';
import { type Filter, type RequestGroup, type RequestGroupField, type Store } from '../../types.ts';
import { envsCreated, selectEnvEntities } from '../envs/slice.ts';
import { selectLogEntities } from '../logs/slice.ts';
import { selectStepEntities } from '../steps/slice.ts';
import { sortEnvs } from './helpers.ts';

const requestGroupsAdapter = createEntityAdapter<RequestGroup>();

export const requestGroupsSlice = createSlice({
  extraReducers: builder => {
    builder.addCase(envsCreated, (state, action) => {
      const requestGroups = Object.keys(action.payload).reduce((acc: Record<string, RequestGroup>, key) => {
        const env = action.payload[key];

        if (!env) {
          return acc;
        }

        const id = env.requestGroup;

        const requestGroup = acc[id] ?? {
          envs: [],
          id,
          timestamp: '',
        };

        requestGroup.envs.push(env.id);
        requestGroup.envs.sort(sortEnvs(action.payload));
        requestGroup.timestamp = requestGroup.envs[0] ? action.payload[requestGroup.envs[0]]?.timestamp ?? '' : '';
        acc[id] = requestGroup;
        return acc;
      }, {});

      requestGroupsAdapter.upsertMany(state, requestGroups);
    });
  },
  initialState: requestGroupsAdapter.getInitialState(),
  name: 'requestGroups',
  reducers: {},
});

const {
  selectAll: selectAllRequestGroups,
  selectById: selectRequestGroupById,
  selectEntities: selectRequestGroupEntities,
  selectIds: selectRequestGroupIds,
  selectTotal: selectRequestGroupTotal,
} = requestGroupsAdapter.getSelectors<Store>(state => state.requestGroups);

export {
  selectAllRequestGroups,
  selectRequestGroupById,
  selectRequestGroupEntities,
  selectRequestGroupIds,
  selectRequestGroupTotal,
};

export const selectRequestGroupsSortedByTimestamp = createSelector(selectAllRequestGroups, requestGroups =>
  requestGroups.sort((a, b) => {
    const timestampA = new Date(a.timestamp).valueOf();
    const timestampB = new Date(b.timestamp).valueOf();

    if (timestampA > timestampB) {
      return -1;
    }

    if (timestampA < timestampB) {
      return 1;
    }

    return 0;
  })
);

export const selectRequestGroupIdsFiltered = createSelector(
  [
    (store: Store) => store,
    selectRequestGroupsSortedByTimestamp,
    (_state: Store, filters: ([Filter] | [Filter, JsonValue])[]) => filters,
  ],
  (store, requestGroups, filters) => {
    if (filters.length === 0) {
      return requestGroups.map(requestGroup => requestGroup.id);
    }

    return requestGroups
      .filter(requestGroup =>
        filters.every(entry => {
          const [filter, configValue] = castArray(entry) as [Filter, JsonValue?];
          return filter(store, requestGroup, configValue);
        })
      )
      .map(requestGroup => requestGroup.id);
  }
);

export const selectRequestGroupIdsSortedByTimestamp = createSelector(
  selectRequestGroupsSortedByTimestamp,
  requestGroups => requestGroups.map(requestGroup => requestGroup.id)
);

export const selectFirstRequestGroupLogEntry = createSelector(
  [
    (state: Store, requestGroupId: string) => selectRequestGroupById(state, requestGroupId) as RequestGroup,
    selectEnvEntities,
    selectStepEntities,
    selectLogEntities,
  ],
  (requestGroup, envEntities, stepEntities, logEntities) => {
    const envGroup = envEntities[requestGroup.envs[0]!]!;
    const step = stepEntities[envGroup.steps[0]!]!;
    return logEntities[step.entries[0]!]!;
  }
);

export const selectLastRequestGroupLogEntry = createSelector(
  [
    (state: Store, requestGroupId: string) => selectRequestGroupById(state, requestGroupId) as RequestGroup,
    selectEnvEntities,
    selectStepEntities,
    selectLogEntities,
  ],
  (requestGroup, envEntities, stepEntities, logEntities) => {
    const envGroup = envEntities[requestGroup.envs[requestGroup.envs.length - 1]!]!;
    const step = stepEntities[envGroup.steps[envGroup.steps.length - 1]!]!;
    return logEntities[step.entries[step.entries.length - 1]!]!;
  }
);

export const selectFirstRequestGroupClientOrWorkerLogEntry = createSelector(
  [
    (state: Store, requestGroupId: string) => selectRequestGroupById(state, requestGroupId) as RequestGroup,
    selectEnvEntities,
    selectStepEntities,
    selectLogEntities,
  ],
  (requestGroup, envEntities, stepEntities, logEntities) => {
    const requestGroupEnvEntities = requestGroup.envs.map(id => envEntities[id]!);

    const clientOrWorkerEnvEntity = requestGroupEnvEntities.find(
      entity => entity.label === 'client' || entity.label === 'worker'
    );

    if (!clientOrWorkerEnvEntity) {
      return null;
    }

    const step = stepEntities[clientOrWorkerEnvEntity.steps[0]!]!;
    return logEntities[step.entries[0]!]!;
  }
);

export const selectRequestGroupRequestComplexity = createSelector(
  (state: Store, requestGroupId: string) => selectFirstRequestGroupClientOrWorkerLogEntry(state, requestGroupId),
  logEntry => logEntry?.labels.requestComplexity
);

export const selectRequestGroupRequestDepth = createSelector(
  (state: Store, requestGroupId: string) => selectFirstRequestGroupClientOrWorkerLogEntry(state, requestGroupId),
  logEntry => logEntry?.labels.requestDepth
);

export const selectRequestGroupDuration = createSelector(
  (state: Store, requestGroupId: string) => selectLastRequestGroupLogEntry(state, requestGroupId),
  logEntry => logEntry.labels.duration
);

export const selectRequestGroupError = createSelector(
  (state: Store, requestGroupId: string) => selectLastRequestGroupLogEntry(state, requestGroupId),
  logEntry => logEntry.error
);

export const selectRequestGroupErrorMessage = createSelector(
  (state: Store, requestGroupId: string) => selectRequestGroupError(state, requestGroupId),
  error => error?.message
);

export const selectRequestGroupErrorType = createSelector(
  (state: Store, requestGroupId: string) => selectRequestGroupError(state, requestGroupId),
  error => error?.type
);

export const selectRequestGroupOperation = createSelector(
  (state: Store, requestGroupId: string) => selectFirstRequestGroupLogEntry(state, requestGroupId),
  logEntry => logEntry.labels.operation
);

export const selectRequestGroupOperationName = createSelector(
  (state: Store, requestGroupId: string) => selectFirstRequestGroupLogEntry(state, requestGroupId),
  logEntry => logEntry.labels.operationName
);

export const selectRequestGroupTimestamp = createSelector(
  (state: Store, requestGroupId: string) => selectRequestGroupById(state, requestGroupId) as RequestGroup,
  requestGroup => requestGroup.timestamp
);

export const selectRequestGroupUrl = createSelector(
  (state: Store, requestGroupId: string) => selectFirstRequestGroupLogEntry(state, requestGroupId),
  logEntry => {
    if (!logEntry.labels.url) {
      return '';
    }

    const url = new URL(logEntry.labels.url);
    return `${url.pathname}${url.search}`;
  }
);

export const selectRequestGroupVariables = createSelector(
  (state: Store, requestGroupId: string) => selectFirstRequestGroupLogEntry(state, requestGroupId),
  logEntry => logEntry.labels.variables
);

const requestGroupFields = {
  complexity: selectRequestGroupRequestComplexity,
  depth: selectRequestGroupRequestDepth,
  duration: selectRequestGroupDuration,
  error: selectRequestGroupErrorMessage,
  operation: selectRequestGroupOperation,
  operationName: selectRequestGroupOperationName,
  origin: selectRequestGroupUrl,
  timestamp: selectRequestGroupTimestamp,
  variables: selectRequestGroupVariables,
};

export const selectRequestGroupFieldKeyValuePairs = createSelector(
  (state: Store, requestGroupId: string, fields: RequestGroupField[]) =>
    fields.map(fieldName => [fieldName, requestGroupFields[fieldName](state, requestGroupId)]),
  fieldKeyValuePairs => fieldKeyValuePairs as [RequestGroupField, string | number | JsonObject | undefined][]
);

export const selectRequestGroupFieldValueMissing = createSelector(
  (state: Store, requestGroupId: string, fields: RequestGroupField[]) =>
    fields.reduce((values: (string | number | JsonObject | undefined)[], fieldName) => {
      if (fieldName === 'error' || fieldName === 'variables') {
        return values;
      }

      return [...values, requestGroupFields[fieldName](state, requestGroupId)];
    }, []),
  values =>
    values.reduce((missing, value) => {
      if (missing) {
        return missing;
      }

      return isUndefined(value);
    }, false)
);

export const selectFilteredRequestGroupErrorTypes = createSelector(
  [
    (store: Store) => store,
    (state: Store, filters: ([Filter] | [Filter, JsonValue])[]) => selectRequestGroupIdsFiltered(state, filters),
  ],
  (store, filteredRequestGroupIds) =>
    filteredRequestGroupIds
      .reduce((types: string[], id) => {
        const type = selectRequestGroupErrorType(store, id);

        if (!!type && !types.includes(type)) {
          types.push(type);
        }

        return types;
      }, [])
      .sort()
);

export const selectFilteredRequestGroupOperationNames = createSelector(
  [
    (store: Store) => store,
    (state: Store, filters: ([Filter] | [Filter, JsonValue])[]) => selectRequestGroupIdsFiltered(state, filters),
  ],
  (store, filteredRequestGroupIds) =>
    filteredRequestGroupIds
      .reduce((names: string[], id) => {
        const name = selectRequestGroupOperationName(store, id);

        if (!!name && !names.includes(name)) {
          names.push(name);
        }

        return names;
      }, [])
      .sort()
);
