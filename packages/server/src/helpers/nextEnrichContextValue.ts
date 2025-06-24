import { type ServerRequestOptions } from '@graphql-box/core';
import { type NextRequest } from 'next/server.js';

export const nextEnrichContextValue = (req: NextRequest, options: ServerRequestOptions): ServerRequestOptions => {
  const headersList = req.headers;
  const cookieStore = req.cookies;
  const userAgent = headersList.get('user-agent') ?? undefined;

  return {
    ...options,
    contextValue: {
      ...options.contextValue,
      data: {
        ...options.contextValue?.data,
        apiRequestType: 'API_REQUEST',
        apiRouteHeaders: headersList,
        apiRouteUrl: req.nextUrl.href,
        browserPathname: headersList.get('x-browser-pathname'),
        browserUrl: headersList.get('x-browser-href'),
        cookies: cookieStore.getAll(),
        ipAddress: headersList.get('x-real-ip') ?? headersList.get('x-forwarded-for'),
        referer: headersList.get('referer'),
        userAgent,
      },
    },
  };
};
