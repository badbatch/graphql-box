import { type CacheTiersEnabled } from '../types.ts';

export const allCacheTiersDisabled = ({ entity, queryResponse, requestPath }: CacheTiersEnabled) =>
  !entity && !queryResponse && !requestPath;

export const entityCacheTierEnabled = (tiersEnabled: CacheTiersEnabled) => !!tiersEnabled.entity;

export const entityOrRequestPathCacheTiersEnabled = ({ entity, requestPath }: CacheTiersEnabled) =>
  !!(entity ?? requestPath);

export const queryResponseCacheTierEnabled = (tiersEnabled: CacheTiersEnabled) => !!tiersEnabled.queryResponse;

export const requestPathCacheTierEnabled = (tiersEnabled: CacheTiersEnabled) => !!tiersEnabled.requestPath;

export const someCacheTiersEnabled = (tiersEnabled: CacheTiersEnabled) => !allCacheTiersDisabled(tiersEnabled);
