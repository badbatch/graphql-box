import { type RequestData } from '@graphql-box/core';
import { keys } from 'lodash-es';
import { type CacheManagerContext } from '../types.ts';

export type FragmentSpreadCheckist = Record<
  string,
  {
    deleted: number;
    paths: string[];
    total: number;
  }
>;

export const createFragmentSpreadChecklist = ({ request }: RequestData, { fragmentDefinitions }: CacheManagerContext) =>
  keys(fragmentDefinitions ?? {}).reduce((acc: FragmentSpreadCheckist, name) => {
    acc[name] = { deleted: 0, paths: [], total: (request.match(new RegExp(`\\.\\.\\.${name}`, 'g')) ?? []).length };
    return acc;
  }, {});
