import { type Environment } from '../types.ts';

export const getEnvSpecificLabels = (env: Environment) => {
  if (env === 'server' && typeof window === 'undefined') {
    const { platform, version } = process;

    return {
      nodeVersion: version,
      osPlatform: platform,
    };
  }

  if (typeof window !== 'undefined') {
    const { userAgent } = window.navigator;
    const { href, pathname, port, protocol, search } = window.location;

    return {
      path: pathname,
      port,
      protocol,
      queryString: search,
      url: href,
      userAgent,
    };
  }

  return {};
};
