export const logErrorsToConsole = <Type extends { errors?: Error[] | readonly Error[] }>(res: Type) => {
  if (process.env.NODE_ENV === 'development' && res.errors) {
    for (const error of res.errors) {
      console.error(error);
    }
  }

  return res;
};
