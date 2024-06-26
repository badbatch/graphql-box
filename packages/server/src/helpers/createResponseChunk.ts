import { type PartialDehydratedRequestResult } from '@graphql-box/core';

export const createResponseChunk = (requestResult: PartialDehydratedRequestResult) => {
  const chunk = Buffer.from(JSON.stringify(requestResult), 'utf8');

  return [
    '',
    '---',
    'Content-Type: application/json; charset=utf-8',
    'Content-Length: ' + String(chunk.length),
    '',
    chunk,
    '',
  ].join('\r\n');
};
