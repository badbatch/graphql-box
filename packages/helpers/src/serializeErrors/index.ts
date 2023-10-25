import { type DeserializedGraphqlError, type PlainObject } from '@graphql-box/core';
import { GraphQLError, Source } from 'graphql';
import { isArray, isObject, isPlainObject } from 'lodash-es';
import { type ErrorObject, deserializeError as deserialize, serializeError as serialize } from 'serialize-error';

export const deserializedGraphqlError = (obj: DeserializedGraphqlError): GraphQLError => {
  const originalError = new Error(obj.originalError.message);
  originalError.stack = obj.originalError.stack;

  const graphqlError = new GraphQLError(obj.message, {
    nodes: obj.nodes,
    originalError,
    path: obj.path,
    positions: obj.positions,
    source: new Source(obj.source.body, obj.source.name, obj.source.locationOffset),
  });

  graphqlError.stack = obj.stack;
  return graphqlError;
};

export const deserializeError = (error: DeserializedGraphqlError | ErrorObject) =>
  error.name === 'GraphQLError' ? deserializedGraphqlError(error as DeserializedGraphqlError) : deserialize(error);

export const deserializeErrors = <Type extends { errors?: (DeserializedGraphqlError | ErrorObject)[] }>({
  errors,
  ...rest
}: Type) => {
  if (!errors) {
    return rest as Type & { errors?: Error[] | readonly Error[] };
  }

  const output = {
    ...rest,
    errors: errors.map(error => deserializeError(error)),
  };

  return output as Type & { errors: Error[] | readonly Error[] };
};

export const serializeGraphqlError = (error: GraphQLError) => {
  const cloneOwnProperties = (instance: PlainObject) =>
    Object.getOwnPropertyNames(instance).reduce((obj: PlainObject, name) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const value = instance[name];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      obj[name] = isObject(value) && !isArray(value) && !isPlainObject(value) ? cloneOwnProperties(value) : value;

      return obj;
    }, {});

  return cloneOwnProperties(error);
};

export const serializeError = (error: Error) =>
  error instanceof GraphQLError ? serializeGraphqlError(error) : serialize(error);

export const serializeErrors = <Type extends { errors?: Error[] | readonly Error[] }>({ errors, ...rest }: Type) => {
  if (!errors) {
    return rest as Type & { errors?: (DeserializedGraphqlError | ErrorObject)[] };
  }

  const output = {
    ...rest,
    errors: errors.map(error => serializeError(error)),
  };

  return output as Type & { errors: (DeserializedGraphqlError | ErrorObject)[] };
};
