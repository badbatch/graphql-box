import { type Environment } from '../types.ts';

export const getEnvSpecificLabels = (env: Environment) => {
  if (env === 'server' && typeof globalThis === 'undefined') {
    const { platform, version } = process;

    return {
      nodeVersion: version,
      osPlatform: platform,
    };
  }

  if (typeof globalThis !== 'undefined') {
    const { userAgent } = globalThis.navigator;

    // Seems like it is possible for this to be undefined
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (globalThis.location) {
      const { href, pathname, port, protocol, search } = globalThis.location;

      return {
        path: pathname,
        port,
        protocol,
        queryString: search,
        url: href,
        userAgent,
      };
    }
  }

  return {};
};
