import { Cacheability } from 'cacheability';
import { type PartialDehydratedRequestResult } from '@graphql-box/core';
import { type ExpectedExportCacheResult } from '../types.ts';

const numberMock = jasmine.any(Number);

export const response: Omit<PartialDehydratedRequestResult, 'requestID'> = {
  _cacheMetadata: {
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
      'dataEntities::Repository::MDEwOlJlcG9zaXRvcnk0NTU2MDA=',
      {
        description: 'A virtual machine for executing programs written in Hack.',
        homepageUrl: 'https://hhvm.com',
        id: 'MDEwOlJlcG9zaXRvcnk0NTU2MDA=',
        name: 'hhvm',
        owner: {
          __cacheKey: 'dataEntities::RepositoryOwner::MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
        },
      },
    ],
    [
      'dataEntities::Repository::MDEwOlJlcG9zaXRvcnk1NjU0MjY=',
      {
        description: 'Python wrapper for RE2',
        homepageUrl: '',
        id: 'MDEwOlJlcG9zaXRvcnk1NjU0MjY=',
        name: 'pyre2',
        owner: {
          __cacheKey: 'dataEntities::RepositoryOwner::MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
        },
      },
    ],
    [
      'dataEntities::Repository::MDEwOlJlcG9zaXRvcnk2MTkyNDA=',
      {
        description: null,
        homepageUrl: 'http://ogp.me',
        id: 'MDEwOlJlcG9zaXRvcnk2MTkyNDA=',
        name: 'open-graph-protocol',
        owner: {
          __cacheKey: 'dataEntities::RepositoryOwner::MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
        },
      },
    ],
    [
      'dataEntities::Repository::MDEwOlJlcG9zaXRvcnk2NTkzNDE=',
      {
        description: 'Used to integrate Android apps with Facebook Platform.',
        homepageUrl: 'https://developers.facebook.com/docs/android',
        id: 'MDEwOlJlcG9zaXRvcnk2NTkzNDE=',
        name: 'facebook-android-sdk',
        owner: {
          __cacheKey: 'dataEntities::RepositoryOwner::MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
        },
      },
    ],
    [
      'dataEntities::Repository::MDEwOlJlcG9zaXRvcnk3Mzg0OTE=',
      {
        description: 'Used to integrate the Facebook Platform with your iOS & tvOS apps.',
        homepageUrl: 'https://developers.facebook.com/docs/ios',
        id: 'MDEwOlJlcG9zaXRvcnk3Mzg0OTE=',
        name: 'facebook-objc-sdk',
        owner: {
          __cacheKey: 'dataEntities::RepositoryOwner::MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
        },
      },
    ],
    [
      'dataEntities::Repository::MDEwOlJlcG9zaXRvcnkxNjU4ODM=',
      {
        description:
          'Codemod is a tool/library to assist you with large-scale codebase refactors that can be partially automated but still require human oversight and occasional intervention. Codemod was developed at Facebook and released as open source.',
        homepageUrl: '',
        id: 'MDEwOlJlcG9zaXRvcnkxNjU4ODM=',
        name: 'codemod',
        owner: {
          __cacheKey: 'dataEntities::RepositoryOwner::MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
        },
      },
    ],
    [
      'dataEntities::RepositoryOwner::MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
      {
        __typename: 'Organization',
        id: 'MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
        login: 'facebook',
        name: 'Facebook',
        url: 'https://github.com/facebook',
      },
    ],
    [
      'queryResponses::2a0b8ac261139c6615fcf79f54ef01bd',
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
          'query.organization.repositories': {
            cacheControl: {
              maxAge: 1,
              public: true,
            },
            ttl: 297_475_201_000,
          },
          'query.organization.repositories.edges': {
            cacheControl: {
              maxAge: 1,
              public: true,
            },
            ttl: 297_475_201_000,
          },
          'query.organization.repositories.edges.node': {
            cacheControl: {
              maxAge: 3,
              public: true,
            },
            ttl: 297_475_203_000,
          },
          'query.organization.repositories.edges.node.owner': {
            cacheControl: {
              maxAge: 3,
              public: true,
            },
            ttl: 297_475_203_000,
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
            repositories: {
              edges: [
                {
                  node: {
                    description:
                      'Codemod is a tool/library to assist you with large-scale codebase refactors that can be partially automated but still require human oversight and occasional intervention. Codemod was developed at Facebook and released as open source.',
                    homepageUrl: '',
                    id: 'MDEwOlJlcG9zaXRvcnkxNjU4ODM=',
                    name: 'codemod',
                    owner: {
                      __typename: 'Organization',
                      id: 'MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
                      login: 'facebook',
                      name: 'Facebook',
                      url: 'https://github.com/facebook',
                    },
                  },
                },
                {
                  node: {
                    description: 'A virtual machine for executing programs written in Hack.',
                    homepageUrl: 'https://hhvm.com',
                    id: 'MDEwOlJlcG9zaXRvcnk0NTU2MDA=',
                    name: 'hhvm',
                    owner: {
                      __typename: 'Organization',
                      id: 'MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
                      login: 'facebook',
                      name: 'Facebook',
                      url: 'https://github.com/facebook',
                    },
                  },
                },
                {
                  node: {
                    description: 'Python wrapper for RE2',
                    homepageUrl: '',
                    id: 'MDEwOlJlcG9zaXRvcnk1NjU0MjY=',
                    name: 'pyre2',
                    owner: {
                      __typename: 'Organization',
                      id: 'MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
                      login: 'facebook',
                      name: 'Facebook',
                      url: 'https://github.com/facebook',
                    },
                  },
                },
                {
                  node: {
                    description: null,
                    homepageUrl: 'http://ogp.me',
                    id: 'MDEwOlJlcG9zaXRvcnk2MTkyNDA=',
                    name: 'open-graph-protocol',
                    owner: {
                      __typename: 'Organization',
                      id: 'MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
                      login: 'facebook',
                      name: 'Facebook',
                      url: 'https://github.com/facebook',
                    },
                  },
                },
                {
                  node: {
                    description: 'Used to integrate Android apps with Facebook Platform.',
                    homepageUrl: 'https://developers.facebook.com/docs/android',
                    id: 'MDEwOlJlcG9zaXRvcnk2NTkzNDE=',
                    name: 'facebook-android-sdk',
                    owner: {
                      __typename: 'Organization',
                      id: 'MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
                      login: 'facebook',
                      name: 'Facebook',
                      url: 'https://github.com/facebook',
                    },
                  },
                },
                {
                  node: {
                    description: 'Used to integrate the Facebook Platform with your iOS & tvOS apps.',
                    homepageUrl: 'https://developers.facebook.com/docs/ios',
                    id: 'MDEwOlJlcG9zaXRvcnk3Mzg0OTE=',
                    name: 'facebook-objc-sdk',
                    owner: {
                      __typename: 'Organization',
                      id: 'MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
                      login: 'facebook',
                      name: 'Facebook',
                      url: 'https://github.com/facebook',
                    },
                  },
                },
              ],
            },
            url: 'https://github.com/facebook',
          },
        },
      },
    ],
    [
      'queryResponses::ea1cbc58eca798225b53f59d95ffb23a',
      {
        cacheMetadata: {
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
      'requestFieldPaths::027fe08f84ad0a2b5437c86ed15f50c8',
      {
        description: 'Used to integrate Android apps with Facebook Platform.',
        homepageUrl: 'https://developers.facebook.com/docs/android',
        id: 'MDEwOlJlcG9zaXRvcnk2NTkzNDE=',
        name: 'facebook-android-sdk',
        owner: {
          __cacheKey: 'requestFieldPaths::8b1b7ba7c8eda6898f88c6975535c524',
        },
      },
    ],
    [
      'requestFieldPaths::2006a409742a6aa7aa0c1758c770cfd2',
      {
        description: null,
        homepageUrl: 'http://ogp.me',
        id: 'MDEwOlJlcG9zaXRvcnk2MTkyNDA=',
        name: 'open-graph-protocol',
        owner: {
          __cacheKey: 'requestFieldPaths::b0b013e9fa72a5a9dd854d0ebe96d629',
        },
      },
    ],
    [
      'requestFieldPaths::21e8076c41db5f0c66930106377ebbdc',
      {
        __typename: 'Organization',
        id: 'MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
        login: 'facebook',
        name: 'Facebook',
        url: 'https://github.com/facebook',
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
    [
      'requestFieldPaths::87b204dfb276479261afc6ed9a74c96c',
      {
        __typename: 'Organization',
        id: 'MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
        login: 'facebook',
        name: 'Facebook',
        url: 'https://github.com/facebook',
      },
    ],
    [
      'requestFieldPaths::8b1b7ba7c8eda6898f88c6975535c524',
      {
        __typename: 'Organization',
        id: 'MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
        login: 'facebook',
        name: 'Facebook',
        url: 'https://github.com/facebook',
      },
    ],
    [
      'requestFieldPaths::9b6f480860437518432fa4e56252825d',
      {
        description: 'A virtual machine for executing programs written in Hack.',
        homepageUrl: 'https://hhvm.com',
        id: 'MDEwOlJlcG9zaXRvcnk0NTU2MDA=',
        name: 'hhvm',
        owner: {
          __cacheKey: 'requestFieldPaths::87b204dfb276479261afc6ed9a74c96c',
        },
      },
    ],
    [
      'requestFieldPaths::b0b013e9fa72a5a9dd854d0ebe96d629',
      {
        __typename: 'Organization',
        id: 'MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
        login: 'facebook',
        name: 'Facebook',
        url: 'https://github.com/facebook',
      },
    ],
    [
      'requestFieldPaths::d8154782d2727cf7630dc81cdd12fa2b',
      {
        description: 'Python wrapper for RE2',
        homepageUrl: '',
        id: 'MDEwOlJlcG9zaXRvcnk1NjU0MjY=',
        name: 'pyre2',
        owner: {
          __cacheKey: 'requestFieldPaths::ffa65fdcf6b1370af59f364589a51214',
        },
      },
    ],
    [
      'requestFieldPaths::da942e5e50337b7d4495590126407fd8',
      {
        edges: [
          {
            node: {
              __cacheKey: 'requestFieldPaths::ef681506ce96960ba2f1faeb46dc4311',
            },
          },
          {
            node: {
              __cacheKey: 'requestFieldPaths::9b6f480860437518432fa4e56252825d',
            },
          },
          {
            node: {
              __cacheKey: 'requestFieldPaths::d8154782d2727cf7630dc81cdd12fa2b',
            },
          },
          {
            node: {
              __cacheKey: 'requestFieldPaths::2006a409742a6aa7aa0c1758c770cfd2',
            },
          },
          {
            node: {
              __cacheKey: 'requestFieldPaths::027fe08f84ad0a2b5437c86ed15f50c8',
            },
          },
          {
            node: {
              __cacheKey: 'requestFieldPaths::e837bc099bd7b2e544e29234260d9ead',
            },
          },
        ],
      },
    ],
    [
      'requestFieldPaths::e837bc099bd7b2e544e29234260d9ead',
      {
        description: 'Used to integrate the Facebook Platform with your iOS & tvOS apps.',
        homepageUrl: 'https://developers.facebook.com/docs/ios',
        id: 'MDEwOlJlcG9zaXRvcnk3Mzg0OTE=',
        name: 'facebook-objc-sdk',
        owner: {
          __cacheKey: 'requestFieldPaths::fac0b5026f368ef4428db067436423db',
        },
      },
    ],
    [
      'requestFieldPaths::ef681506ce96960ba2f1faeb46dc4311',
      {
        description:
          'Codemod is a tool/library to assist you with large-scale codebase refactors that can be partially automated but still require human oversight and occasional intervention. Codemod was developed at Facebook and released as open source.',
        homepageUrl: '',
        id: 'MDEwOlJlcG9zaXRvcnkxNjU4ODM=',
        name: 'codemod',
        owner: {
          __cacheKey: 'requestFieldPaths::21e8076c41db5f0c66930106377ebbdc',
        },
      },
    ],
    [
      'requestFieldPaths::fac0b5026f368ef4428db067436423db',
      {
        __typename: 'Organization',
        id: 'MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
        login: 'facebook',
        name: 'Facebook',
        url: 'https://github.com/facebook',
      },
    ],
    [
      'requestFieldPaths::ffa65fdcf6b1370af59f364589a51214',
      {
        __typename: 'Organization',
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
            maxAge: 3,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_203_000,
        },
      }),
      key: 'dataEntities::Repository::MDEwOlJlcG9zaXRvcnk0NTU2MDA=',
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
            maxAge: 3,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_203_000,
        },
      }),
      key: 'dataEntities::Repository::MDEwOlJlcG9zaXRvcnk1NjU0MjY=',
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
            maxAge: 3,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_203_000,
        },
      }),
      key: 'dataEntities::Repository::MDEwOlJlcG9zaXRvcnk2MTkyNDA=',
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
            maxAge: 3,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_203_000,
        },
      }),
      key: 'dataEntities::Repository::MDEwOlJlcG9zaXRvcnk2NTkzNDE=',
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
            maxAge: 3,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_203_000,
        },
      }),
      key: 'dataEntities::Repository::MDEwOlJlcG9zaXRvcnk3Mzg0OTE=',
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
            maxAge: 3,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_203_000,
        },
      }),
      key: 'dataEntities::Repository::MDEwOlJlcG9zaXRvcnkxNjU4ODM=',
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
            maxAge: 3,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_203_000,
        },
      }),
      key: 'dataEntities::RepositoryOwner::MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
      lastAccessed: 297_475_200_000,
      lastUpdated: 297_475_200_000,
      size: numberMock,
      tags: [],
      updatedCount: 5,
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
      key: 'queryResponses::2a0b8ac261139c6615fcf79f54ef01bd',
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
            noCache: true,
          },
          etag: undefined,
          ttl: 0,
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
            maxAge: 3,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_203_000,
        },
      }),
      key: 'requestFieldPaths::027fe08f84ad0a2b5437c86ed15f50c8',
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
            maxAge: 3,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_203_000,
        },
      }),
      key: 'requestFieldPaths::2006a409742a6aa7aa0c1758c770cfd2',
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
            maxAge: 3,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_203_000,
        },
      }),
      key: 'requestFieldPaths::21e8076c41db5f0c66930106377ebbdc',
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
    {
      accessedCount: numberMock,
      added: 297_475_200_000,
      cacheability: new Cacheability({
        metadata: {
          cacheControl: {
            maxAge: 3,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_203_000,
        },
      }),
      key: 'requestFieldPaths::87b204dfb276479261afc6ed9a74c96c',
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
            maxAge: 3,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_203_000,
        },
      }),
      key: 'requestFieldPaths::8b1b7ba7c8eda6898f88c6975535c524',
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
            maxAge: 3,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_203_000,
        },
      }),
      key: 'requestFieldPaths::9b6f480860437518432fa4e56252825d',
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
            maxAge: 3,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_203_000,
        },
      }),
      key: 'requestFieldPaths::b0b013e9fa72a5a9dd854d0ebe96d629',
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
            maxAge: 3,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_203_000,
        },
      }),
      key: 'requestFieldPaths::d8154782d2727cf7630dc81cdd12fa2b',
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
      key: 'requestFieldPaths::da942e5e50337b7d4495590126407fd8',
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
            maxAge: 3,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_203_000,
        },
      }),
      key: 'requestFieldPaths::e837bc099bd7b2e544e29234260d9ead',
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
            maxAge: 3,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_203_000,
        },
      }),
      key: 'requestFieldPaths::ef681506ce96960ba2f1faeb46dc4311',
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
            maxAge: 3,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_203_000,
        },
      }),
      key: 'requestFieldPaths::fac0b5026f368ef4428db067436423db',
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
            maxAge: 3,
            public: true,
          },
          etag: undefined,
          ttl: 297_475_203_000,
        },
      }),
      key: 'requestFieldPaths::ffa65fdcf6b1370af59f364589a51214',
      lastAccessed: 297_475_200_000,
      lastUpdated: 297_475_200_000,
      size: numberMock,
      tags: [],
      updatedCount: 0,
    },
  ],
};
