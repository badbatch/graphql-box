import { pickBy } from 'lodash-es';

const connectionInputOptions = new Set(['after', 'before', 'first', 'last']);

export const removeConnectionInputOptions = <O extends object>(args: O) =>
  pickBy(args, (_value, key) => !connectionInputOptions.has(key));
