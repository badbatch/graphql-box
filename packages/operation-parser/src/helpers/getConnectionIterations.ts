import { type PlainObject } from '@graphql-box/core';
import { type ConnectionInputOptions } from '#types.ts';

const areConnectionInputOptions = (fieldArgs?: PlainObject): fieldArgs is ConnectionInputOptions =>
  !!(fieldArgs?.first ?? fieldArgs?.last);

export const getConnectionIterations = (
  fieldTypeName: string | undefined,
  fieldArgs: PlainObject | undefined,
): number | undefined => {
  if (!fieldTypeName?.endsWith('Connection')) {
    return;
  }

  return areConnectionInputOptions(fieldArgs) ? Number(fieldArgs.first ?? fieldArgs.last) : undefined;
};
