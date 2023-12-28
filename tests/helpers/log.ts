import { type PlainArray } from '@graphql-box/core';

export const log = (...args: PlainArray): void => {
  console.log(...args);
};
