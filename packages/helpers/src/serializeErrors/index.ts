import { DeserializedGraphqlError } from "@graphql-box/core";
import { GraphQLError, Source } from "graphql";
import { isArray, isObject, isPlainObject } from "lodash";
import { ErrorObject, deserializeError as deserialize, serializeError as serialize } from "serialize-error";

export const deserializedGraphqlError = (obj: DeserializedGraphqlError) => {
  const originalError = new Error(obj.originalError.message);
  originalError.stack = obj.originalError.stack;

  const graphqlError = new GraphQLError(
    obj.message,
    obj.nodes,
    new Source(obj.source.body, obj.source.name, obj.source.locationOffset),
    obj.positions,
    obj.path,
    originalError,
  );

  graphqlError.stack = obj.stack;
  return graphqlError;
};

export const deserializeError = (error: DeserializedGraphqlError | ErrorObject) =>
  error.name === "GraphQLError" ? deserializedGraphqlError(error as DeserializedGraphqlError) : deserialize(error);

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
  const cloneOwnProperties = (instance: any) =>
    Object.getOwnPropertyNames(instance).reduce((obj: Record<string, any>, name) => {
      const value = instance[name];

      if (isObject(value) && !isArray(value) && !isPlainObject(value)) {
        obj[name] = cloneOwnProperties(value);
      } else {
        obj[name] = instance[name];
      }

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
