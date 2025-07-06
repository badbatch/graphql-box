import { type PlainObject } from '@graphql-box/core';

export const populateFieldArgs = (
  fieldArguments: PlainObject | undefined,
  variables: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined => {
  if (!(fieldArguments && variables)) {
    return;
  }

  const populatedFieldArgs: Record<string, unknown> = {};

  for (const key in fieldArguments) {
    if (key in variables) {
      populatedFieldArgs[key] = variables[key];
    }
  }

  return populatedFieldArgs;
};
