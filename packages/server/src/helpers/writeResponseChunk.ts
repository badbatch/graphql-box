import { type PartialRequestResultWithDehydratedCacheMetadata } from '@graphql-box/core';
import { type Response } from 'express';
import { isFunction } from 'lodash-es';

export const writeResponseChunk = (res: Response, requestResult: PartialRequestResultWithDehydratedCacheMetadata) => {
  const chunk = Buffer.from(JSON.stringify(requestResult), 'utf8');

  const data = [
    '',
    '---',
    'Content-Type: application/json; charset=utf-8',
    'Content-Length: ' + String(chunk.length),
    '',
    chunk,
    '',
  ].join('\r\n');

  res.write(data);

  if ('flush' in res && isFunction(res.flush)) {
    res.flush();
  }
};
