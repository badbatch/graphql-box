import { type DeserializedGraphqlError, type PlainObject } from '@graphql-box/core';
import { GraphQLError, Source } from 'graphql';
import { type ErrorObject, deserializeError as deserialize, serializeError as serialize } from 'serialize-error';
import { isArray, isPlainObject } from '../lodashProxies.ts';

export const deserializedGraphqlError = (obj: DeserializedGraphqlError): GraphQLError => {
  const originalError = new Error(obj.originalError.message);
  originalError.stack = obj.originalError.stack;
  const source = new Source(obj.source.body, obj.source.name, obj.source.locationOffset);

  const graphqlError = new GraphQLError(obj.message, {
    originalError,
    path: obj.path,
    positions: obj.positions,
    source,
  });

  graphqlError.stack = obj.stack;
  return graphqlError;
};

const isDeserializedGraphqlError = (error: DeserializedGraphqlError | ErrorObject): error is DeserializedGraphqlError =>
  error.name === 'GraphQLError';

export const deserializeError = (error: DeserializedGraphqlError | ErrorObject) =>
  isDeserializedGraphqlError(error) ? deserializedGraphqlError(error) : deserialize(error);

export const deserializeErrors = <Type extends { errors?: (DeserializedGraphqlError | ErrorObject)[] }>({
  errors,
  ...rest
}: Type) => {
  if (!errors) {
    return rest;
  }

  return {
    ...rest,
    errors: errors.map(error => deserializeError(error)),
  };
};

export const serializeGraphqlError = (error: GraphQLError) => {
  const cloneOwnProperties = (instance: object) =>
    Object.getOwnPropertyNames(instance).reduce<PlainObject>((obj, name) => {
      // @ts-expect-error type 'string' can't be used to index type '{}'
      // Helps with typing following code.
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const value = instance[name] as unknown;

      obj[name] =
        !!value && typeof value === 'object' && !isArray(value) && !isPlainObject(value)
          ? cloneOwnProperties(value)
          : value;

      return obj;
    }, {});

  return cloneOwnProperties(error);
};

export const serializeError = (error: Error) =>
  error instanceof GraphQLError ? serializeGraphqlError(error) : serialize(error);

export const serializeErrors = <Type extends { errors?: Error[] | readonly Error[] }>({ errors, ...rest }: Type) => {
  if (!errors) {
    return rest;
  }

  return {
    ...rest,
    errors: errors.map(error => serializeError(error)),
  };
};
