import { type PartialDehydratedRequestResult } from '@graphql-box/core';
import { type Response } from 'express';
import { isFunction } from 'lodash-es';
import { createResponseChunk } from './createResponseChunk.ts';

export const writeResponseChunk = (res: Response, requestResult: PartialDehydratedRequestResult) => {
  res.write(createResponseChunk(requestResult));

  if ('flush' in res && isFunction(res.flush)) {
    res.flush();
  }
};
