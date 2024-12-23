import { Cacheability } from 'cacheability';
import { type PartialDehydratedRequestResult } from '@graphql-box/core';
import { type ExpectedExportCacheResult } from '../types.ts';

const numberMock = jasmine.any(Number);

export const response: Omit<PartialDehydratedRequestResult, 'requestID'> = {
  _cacheMetadata: {
    query: {
      cacheControl: {
        maxAge: 1,
        public: true,
      },
      etag: undefined,
      ttl: 297_475_201_000,
    },
    'query.organization': {
      cacheControl: {
        maxAge: 1,
        public: true,
      },
      etag: undefined,
      ttl: 297_475_201_000,
    },
  },
  data: {
    organization: {
      description:
        'We are working to build community through open source technology. NB: members must have two-factor auth.',
      email: '',
      id: 'MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
      login: 'facebook',
      name: 'Facebook',
      url: 'https://github.com/facebook',
    },
  },
};

export const cache: ExpectedExportCacheResult = {
  entries: [
    [
      'dataEntities::Organization::MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
      {
        description:
          'We are working to build community through open source technology. NB: members must have two-factor auth.',
        email: '',
        id: 'MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
        login: 'facebook',
        name: 'Facebook',
        url: 'https://github.com/facebook',
      },
    ],
    [
      'queryResponses::ea1cbc58eca798225b53f59d95ffb23a',
      {
        cacheMetadata: {
          query: {
            cacheControl: {
              maxAge: 1,
              public: true,
            },
            ttl: 297_475_201_000,
          },
          'query.organization': {
            cacheControl: {
              maxAge: 1,
              public: true,
            },
            ttl: 297_475_201_000,
          },
        },
        data: {
          organization: {
            description:
              'We are working to build community through open source technology. NB: members must have two-factor auth.',
            email: '',
            id: 'MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
            login: 'facebook',
            name: 'Facebook',
            url: 'https://github.com/facebook',
          },
        },
      },
    ],
    [
      'requestFieldPaths::5256db516a2438a7e5488a00413f4809',
      {
        description:
          'We are working to build community through open source technology. NB: members must have two-factor auth.',
        email: '',
        id: 'MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
        login: 'facebook',
        name: 'Facebook',
        url: 'https://github.com/facebook',
      },
    ],
  ],
  metadata: [
    {
      accessedCount: numberMock,
      added: 297_475_200_000,
      cacheability: new Cacheability({
        metadata: {
          cacheControl: {
            maxAge: 1,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_201_000,
        },
      }),
      key: 'dataEntities::Organization::MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
      lastAccessed: 297_475_200_000,
      lastUpdated: 297_475_200_000,
      size: numberMock,
      tags: [],
      updatedCount: 0,
    },
    {
      accessedCount: numberMock,
      added: 297_475_200_000,
      cacheability: new Cacheability({
        metadata: {
          cacheControl: {
            maxAge: 1,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_201_000,
        },
      }),
      key: 'queryResponses::ea1cbc58eca798225b53f59d95ffb23a',
      lastAccessed: 297_475_200_000,
      lastUpdated: 297_475_200_000,
      size: numberMock,
      tags: [],
      updatedCount: 0,
    },
    {
      accessedCount: numberMock,
      added: 297_475_200_000,
      cacheability: new Cacheability({
        metadata: {
          cacheControl: {
            maxAge: 1,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_201_000,
        },
      }),
      key: 'requestFieldPaths::5256db516a2438a7e5488a00413f4809',
      lastAccessed: 297_475_200_000,
      lastUpdated: 297_475_200_000,
      size: numberMock,
      tags: [],
      updatedCount: 0,
    },
  ],
};
