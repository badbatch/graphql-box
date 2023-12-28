import { Cacheability } from 'cacheability';
import type { ExportCacheResult } from '@graphql-box/cache-manager';
import type { PartialRequestResultWithDehydratedCacheMetadata } from '@graphql-box/core';

export const mutationResponse: Omit<PartialRequestResultWithDehydratedCacheMetadata, 'requestID'> = {
  _cacheMetadata: {
    mutation: {
      cacheControl: {
        noCache: true,
      },
      etag: undefined,
      ttl: 0,
    },
    'mutation.addEmail': {
      cacheControl: {
        maxAge: 1,
        public: true,
      },
      etag: undefined,
      ttl: 297_475_201_000,
    },
    'mutation.addEmail.emails': {
      cacheControl: {
        maxAge: 5,
        public: true,
      },
      etag: undefined,
      ttl: 297_475_205_000,
    },
  },
  data: {
    addEmail: {
      emails: [
        {
          from: 'alfa@gmail.com',
          id: 1,
          message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          subject: 'Hi, this is Alfa',
          unread: false,
        },
        {
          from: 'bravo@gmail.com',
          id: 2,
          message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          subject: 'Hi, this is Bravo',
          unread: false,
        },
        {
          from: 'charlie@gmail.com',
          id: 3,
          message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          subject: 'Hi, this is Charlie',
          unread: false,
        },
        {
          from: 'delta@gmail.com',
          id: 4,
          message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          subject: 'Hi, this is Delta',
          unread: true,
        },
      ],
      id: 1,
      total: 4,
      unread: 1,
    },
  },
};

export const subscriptionResponse: Omit<PartialRequestResultWithDehydratedCacheMetadata, 'requestID'> = {
  _cacheMetadata: {
    subscription: {
      cacheControl: {
        noCache: true,
      },
      etag: undefined,
      ttl: 0,
    },
    'subscription.emailAdded': {
      cacheControl: {
        maxAge: 1,
        public: true,
      },
      etag: undefined,
      ttl: 297_475_201_000,
    },
    'subscription.emailAdded.emails': {
      cacheControl: {
        maxAge: 5,
        public: true,
      },
      etag: undefined,
      ttl: 297_475_205_000,
    },
  },
  data: {
    emailAdded: {
      emails: [
        {
          from: 'alfa@gmail.com',
          id: 1,
          message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          subject: 'Hi, this is Alfa',
          unread: false,
        },
        {
          from: 'bravo@gmail.com',
          id: 2,
          message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          subject: 'Hi, this is Bravo',
          unread: false,
        },
        {
          from: 'charlie@gmail.com',
          id: 3,
          message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          subject: 'Hi, this is Charlie',
          unread: false,
        },
        {
          from: 'delta@gmail.com',
          id: 4,
          message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          subject: 'Hi, this is Delta',
          unread: true,
        },
      ],
      id: 1,
      total: 4,
      unread: 1,
    },
  },
};

export const cache: ExportCacheResult = {
  entries: [
    [
      'dataEntities::Email::1',
      {
        from: 'alfa@gmail.com',
        id: 1,
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        subject: 'Hi, this is Alfa',
        unread: false,
      },
    ],
    [
      'dataEntities::Email::2',
      {
        from: 'bravo@gmail.com',
        id: 2,
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        subject: 'Hi, this is Bravo',
        unread: false,
      },
    ],
    [
      'dataEntities::Email::3',
      {
        from: 'charlie@gmail.com',
        id: 3,
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        subject: 'Hi, this is Charlie',
        unread: false,
      },
    ],
    [
      'dataEntities::Email::4',
      {
        from: 'delta@gmail.com',
        id: 4,
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        subject: 'Hi, this is Delta',
        unread: true,
      },
    ],
    [
      'dataEntities::Inbox::1',
      {
        emails: [
          {
            __cacheKey: 'dataEntities::Email::1',
          },
          {
            __cacheKey: 'dataEntities::Email::2',
          },
          {
            __cacheKey: 'dataEntities::Email::3',
          },
          {
            __cacheKey: 'dataEntities::Email::4',
          },
        ],
        id: 1,
        total: 4,
        unread: 1,
      },
    ],
  ],
  metadata: [
    {
      accessedCount: 0,
      added: 297_475_200_000,
      cacheability: new Cacheability({
        metadata: {
          cacheControl: {
            maxAge: 5,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_205_000,
        },
      }),
      key: 'dataEntities::Email::1',
      lastAccessed: 297_475_200_000,
      lastUpdated: 297_475_200_000,
      size: 384,
      tags: [],
      updatedCount: 1,
    },
    {
      accessedCount: 0,
      added: 297_475_200_000,
      cacheability: new Cacheability({
        metadata: {
          cacheControl: {
            maxAge: 5,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_205_000,
        },
      }),
      key: 'dataEntities::Email::2',
      lastAccessed: 297_475_200_000,
      lastUpdated: 297_475_200_000,
      size: 392,
      tags: [],
      updatedCount: 1,
    },
    {
      accessedCount: 0,
      added: 297_475_200_000,
      cacheability: new Cacheability({
        metadata: {
          cacheControl: {
            maxAge: 5,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_205_000,
        },
      }),
      key: 'dataEntities::Email::4',
      lastAccessed: 297_475_200_000,
      lastUpdated: 297_475_200_000,
      size: 392,
      tags: [],
      updatedCount: 1,
    },
    {
      accessedCount: 0,
      added: 297_475_200_000,
      cacheability: new Cacheability({
        metadata: {
          cacheControl: {
            maxAge: 5,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_205_000,
        },
      }),
      key: 'dataEntities::Email::3',
      lastAccessed: 297_475_200_000,
      lastUpdated: 297_475_200_000,
      size: 400,
      tags: [],
      updatedCount: 1,
    },
    {
      accessedCount: 0,
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
      key: 'dataEntities::Inbox::1',
      lastAccessed: 297_475_200_000,
      lastUpdated: 297_475_200_000,
      size: 536,
      tags: [],
      updatedCount: 1,
    },
  ],
};
