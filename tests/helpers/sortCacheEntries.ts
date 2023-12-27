import type { Metadata } from '@cachemap/types';
import type { ExportCacheResult } from '@graphql-box/cache-manager';

const sortEntries = ([keyA]: [string, unknown], [keyB]: [string, unknown]) => {
  if (keyA < keyB) {
    return -1;
  }

  if (keyA > keyB) {
    return 1;
  }

  return 0;
};

const sortMetaData = ({ key: keyA }: Metadata, { key: keyB }: Metadata) => {
  if (keyA < keyB) {
    return -1;
  }

  if (keyA > keyB) {
    return 1;
  }

  return 0;
};

export const sortCacheEntries = ({ entries, metadata }: ExportCacheResult) => ({
  entries: entries.sort(sortEntries),
  metadata: metadata.sort(sortMetaData),
});
