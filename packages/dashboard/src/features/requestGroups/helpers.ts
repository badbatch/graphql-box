import { type Env } from '../../types.ts';

export const sortEnvs = (payload: Record<string, Env>) => (idA: string, idB: string) => {
  const envA = payload[idA]!;
  const envB = payload[idB]!;

  if (envA.logGroup < envB.logGroup) {
    return -1;
  }

  if (envA.logGroup > envB.logGroup) {
    return 1;
  }

  return 0;
};
