import { type PartialDehydratedRequestResult, type PartialRequestResult } from '@graphql-box/core';
import { dehydrateCacheMetadata, serializeErrors } from '@graphql-box/helpers';
import { createResponseChunk } from './createResponseChunk.ts';

export const asyncIteratorToStream = (
  iterator: AsyncIterator<PartialRequestResult | undefined, PartialRequestResult | undefined>,
) =>
  new ReadableStream({
    pull: async controller => {
      const { done, value } = await iterator.next();

      if (done) {
        controller.enqueue('\r\n-----\r\n');
        controller.close();
      } else if (value) {
        const { _cacheMetadata, ...otherProps } = value;
        const response: PartialDehydratedRequestResult = serializeErrors({ ...otherProps });

        if (_cacheMetadata) {
          response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        }

        controller.enqueue(createResponseChunk(response));
      }
    },
  });
