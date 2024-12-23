import { isPlainObject, mergeObjects } from '@graphql-box/helpers';

export const mergeDataSets = <T extends object>(obj: T, source: T, typeIDKey: string): T => {
  return mergeObjects<T>(obj, source, (_key: string, value: unknown): string | number | undefined => {
    // Casting of ease of typing
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return isPlainObject(value) && value[typeIDKey] ? (value[typeIDKey] as string | number) : undefined;
  });
};
