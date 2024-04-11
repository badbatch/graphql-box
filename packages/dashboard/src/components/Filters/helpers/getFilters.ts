import { subSeconds } from 'date-fns';
import { type JsonObject, type JsonValue } from 'type-fest';
import {
  selectRequestGroupErrorMessage,
  selectRequestGroupErrorType,
  selectRequestGroupOperationName,
  selectRequestGroupUrl,
  selectRequestGroupVariables,
} from '../../../features/requestGroups/slice.ts';
import { type Filter, type RequestGroup, type Store } from '../../../types.ts';
import { TimeWindowRange, type TimeWindowValue } from '../../TimeWindow/types.ts';
import { type FilterOptions } from '../types.ts';

const args = (store: Store, requestGroup: RequestGroup, input: string) => {
  const requestGroupVariables = selectRequestGroupVariables(store, requestGroup.id);

  try {
    const variables = JSON.parse(input) as JsonObject;

    return Object.keys(variables).reduce((match: boolean, key) => {
      if (!match) {
        return false;
      }

      const requestGroupVariablesValue = requestGroupVariables[key];

      if (!requestGroupVariablesValue) {
        return false;
      }

      return requestGroupVariablesValue === variables[key];
    }, true);
  } catch {
    return false;
  }
};

const errorType = (store: Store, requestGroup: RequestGroup, type: string) =>
  selectRequestGroupErrorType(store, requestGroup.id) === type;

const errors = (store: Store, requestGroup: RequestGroup, hasErrors: boolean) =>
  hasErrors && !!selectRequestGroupErrorMessage(store, requestGroup.id);

const operationName = (store: Store, requestGroup: RequestGroup, name: string) =>
  selectRequestGroupOperationName(store, requestGroup.id) === name;

const origin = (store: Store, requestGroup: RequestGroup, regex: string) => {
  const requestGroupUrl = selectRequestGroupUrl(store, requestGroup.id);
  return new RegExp(regex).test(requestGroupUrl);
};

const requestId = (_store: Store, requestGroup: RequestGroup, id?: JsonValue) => requestGroup.id === id;

const timeWindow = (
  _store: Store,
  requestGroup: RequestGroup,
  { from, range: key = TimeWindowRange.LAST_15_MINS, to }: Partial<TimeWindowValue> = {}
) => {
  let fromTimestamp: number;
  let toTimestamp: number;

  if (key === TimeWindowRange.SELECT_DATES) {
    fromTimestamp = from!;
    toTimestamp = to!;
  } else {
    const seconds = key.split('*').reduce((acc, multiplier) => acc * Number(multiplier), 1);
    fromTimestamp = subSeconds(new Date(), seconds).valueOf();
    toTimestamp = Date.now();
  }

  const requestGroupTimestamp = new Date(requestGroup.timestamp).valueOf();
  return requestGroupTimestamp > fromTimestamp && requestGroupTimestamp < toTimestamp;
};

const filterFuncs: Record<string, Filter> = {
  args,
  errorType,
  errors,
  operationName,
  origin,
  requestId,
  timeWindow,
};

export const getFilters = (searchParams: URLSearchParams, { mandatory = [] }: FilterOptions = {}) => {
  const mandatoryFilters = mandatory.reduce((acc: [Filter][], key) => {
    const filterFunc = filterFuncs[key];

    if (filterFunc) {
      acc.push([filterFunc]);
    }

    return acc;
  }, []);

  const param = searchParams.get('filters');

  if (!param) {
    return mandatoryFilters;
  }

  const config = JSON.parse(param) as Record<string, JsonValue>;

  return Object.keys(config).reduce((acc: ([Filter] | [Filter, JsonValue])[], configKey) => {
    const configValue = config[configKey];

    if (!configValue) {
      return acc;
    }

    const filterFunc = filterFuncs[configKey];

    if (!filterFunc) {
      return acc;
    }

    const index = acc.findIndex(([func]) => func === filterFunc);

    if (index === -1) {
      acc.push([filterFunc, configValue]);
    } else {
      acc.splice(index, 1, [filterFunc, configValue]);
    }

    return acc;
  }, mandatoryFilters);
};
