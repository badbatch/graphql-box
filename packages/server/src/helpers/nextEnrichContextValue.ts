import { type ServerRequestOptions } from '@graphql-box/core';
import { type NextRequest } from 'next/server.js';
import { UAParser } from 'ua-parser-js';

export const nextEnrichContextValue = (req: NextRequest, options: ServerRequestOptions): ServerRequestOptions => {
  const headersList = req.headers;
  const cookieStore = req.cookies;
  const { browser, cpu, device, engine, os } = UAParser(headersList.get('user-agent') ?? undefined);

  return {
    ...options,
    contextValue: {
      ...options.contextValue,
      data: {
        ...options.contextValue?.data,
        browserName: browser.name,
        browserVersion: browser.version,
        cookies: JSON.stringify(cookieStore.getAll()),
        cpuArchitecture: cpu.architecture,
        deviceModel: device.model,
        deviceType: device.type,
        deviceVendor: device.vendor,
        engineName: engine.name,
        engineVersion: engine.version,
        headers: JSON.stringify(headersList),
        ipAddress: headersList.get('x-real-ip') ?? headersList.get('x-forwarded-for'),
        osName: os.name,
        osVersion: os.version,
        referer: headersList.get('referer'),
        url: req.nextUrl.href,
        userAgent: headersList.get('user-agent'),
      },
    },
  };
};
