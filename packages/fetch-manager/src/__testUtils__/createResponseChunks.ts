import { type PlainObject } from '@graphql-box/core';

export const createResponseChunks = (responses: PlainObject[]) => {
  const chunks = responses.map(response => {
    const chunk = Buffer.from(JSON.stringify(response), 'utf8');

    return [
      '',
      '---',
      'Content-Type: application/json; charset=utf-8',
      'Content-Length: ' + String(chunk.length),
      '',
      chunk,
      '',
    ].join('\r\n');
  });

  return `${chunks.join('')}\r\n-----\r\n`;
};
