import { ErrorObject, deserializeError, serializeError } from "serialize-error";

export const deserializeErrors = <Type extends { errors?: ErrorObject[] }>({ errors, ...rest }: Type) => {
  if (!errors) {
    return rest;
  }

  return {
    ...rest,
    errors: errors.map(error => deserializeError(error)),
  };
};

export const serializeErrors = <Type extends { errors?: Error[] | readonly Error[] }>({ errors, ...rest }: Type) => {
  if (!errors) {
    return rest;
  }

  return {
    ...rest,
    errors: errors.map(error => serializeError(error)),
  };
};
