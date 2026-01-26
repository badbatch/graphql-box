import { type ResponseData } from '@graphql-box/core';

export const facebookQuery: ResponseData = {
  data: {
    organization: {
      __typename: 'Organization',
      email: 'opensource@fb.com',
      id: 'MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
      login: 'facebook',
      name: 'Facebook',
    },
  },
  extensions: {
    cacheMetadata: {
      'Organization:MDEyOk9yZ2FuaXphdGlvbjY5NjMx': {
        cacheControl: {
          maxAge: 5,
        },
        ttl: 297_475_205_000,
      },
      'organization({"login":"facebook"})': {
        cacheControl: {
          maxAge: 5,
        },
        ttl: 297_475_205_000,
      },
    },
  },
};

export const googleQuery: ResponseData = {
  data: {
    organization: {
      __typename: 'Organization',
      email: 'opensource@google.com',
      id: 'MDEyOk9yZ2FuaXphdGlvbjEzNDIwMDQ=',
      login: 'google',
      name: 'Google',
    },
  },
  extensions: {
    cacheMetadata: {
      'Organization:MDEyOk9yZ2FuaXphdGlvbjEzNDIwMDQ=': {
        cacheControl: {
          maxAge: 5,
        },
        ttl: 297_475_205_000,
      },
      'organization({"login":"google"})': {
        cacheControl: {
          maxAge: 5,
        },
        ttl: 297_475_205_000,
      },
    },
  },
};

export const facebookQueryWithConnectionWithNestedInlineFragment = {
  data: {
    organization: {
      __typename: 'Organization',
      description: 'We build technologies that help people connect.',
      email: 'opensource@fb.com',
      id: 'O_kgDOAABc',
      login: 'facebook',
      name: 'Meta',
      repositories: {
        __typename: 'RepositoryConnection',
        edges: [
          {
            __typename: 'RepositoryEdge',
            node: {
              __typename: 'Repository',
              description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
              homepageUrl: 'https://react.dev',
              id: 'R_kgDOABCD1',
              name: 'react',
              owner: {
                __typename: 'Organization',
                id: 'O_kgDOAABc',
                login: 'facebook',
                name: 'Meta',
                url: 'https://github.com/facebook',
              },
            },
          },
          {
            __typename: 'RepositoryEdge',
            node: {
              __typename: 'Repository',
              description: 'A JavaScript library for building user interfaces.',
              homepageUrl: 'https://reactnative.dev',
              id: 'R_kgDOABCD2',
              name: 'react-native',
              owner: {
                __typename: 'Organization',
                id: 'O_kgDOAABc',
                login: 'facebook',
                name: 'Meta',
                url: 'https://github.com/facebook',
              },
            },
          },
          {
            __typename: 'RepositoryEdge',
            node: {
              __typename: 'Repository',
              description: 'A fast, extensible, and developer-friendly build tool.',
              homepageUrl: 'https://jestjs.io',
              id: 'R_kgDOABCD3',
              name: 'jest',
              owner: {
                __typename: 'Organization',
                id: 'O_kgDOAABc',
                login: 'facebook',
                name: 'Meta',
                url: 'https://github.com/facebook',
              },
            },
          },
          {
            __typename: 'RepositoryEdge',
            node: {
              __typename: 'Repository',
              description: 'A JavaScript engine optimized for running React Native.',
              homepageUrl: 'https://hermesengine.dev',
              id: 'R_kgDOABCD4',
              name: 'hermes',
              owner: {
                __typename: 'Organization',
                id: 'O_kgDOAABc',
                login: 'facebook',
                name: 'Meta',
                url: 'https://github.com/facebook',
              },
            },
          },
          {
            __typename: 'RepositoryEdge',
            node: {
              __typename: 'Repository',
              description: 'GraphQL reference implementation.',
              homepageUrl: 'https://graphql.org',
              id: 'R_kgDOABCD5',
              name: 'graphql-js',
              owner: {
                __typename: 'Organization',
                id: 'O_kgDOAABc',
                login: 'facebook',
                name: 'Meta',
                url: 'https://github.com/facebook',
              },
            },
          },
          {
            __typename: 'RepositoryEdge',
            node: {
              __typename: 'Repository',
              description: 'A toolchain for building scalable web applications.',
              homepageUrl: 'https://relay.dev',
              id: 'R_kgDOABCD6',
              name: 'relay',
              owner: {
                __typename: 'Organization',
                id: 'O_kgDOAABc',
                login: 'facebook',
                name: 'Meta',
                url: 'https://github.com/facebook',
              },
            },
          },
        ],
      },
    },
  },
  extensions: {
    cacheMetadata: {
      'Organization:O_kgDOAABc': {
        cacheControl: {
          maxAge: 10,
        },
        ttl: 297_475_210_000,
      },
      'Repository:R_kgDOABCD1': {
        cacheControl: {
          maxAge: 10,
        },
        ttl: 297_475_210_000,
      },
      'Repository:R_kgDOABCD2': {
        cacheControl: {
          maxAge: 10,
        },
        ttl: 297_475_210_000,
      },
      'Repository:R_kgDOABCD3': {
        cacheControl: {
          maxAge: 10,
        },
        ttl: 297_475_210_000,
      },
      'Repository:R_kgDOABCD4': {
        cacheControl: {
          maxAge: 10,
        },
        ttl: 297_475_210_000,
      },
      'Repository:R_kgDOABCD5': {
        cacheControl: {
          maxAge: 10,
        },
        ttl: 297_475_210_000,
      },
      'Repository:R_kgDOABCD6': {
        cacheControl: {
          maxAge: 10,
        },
        ttl: 297_475_210_000,
      },
      'organization({"login":"facebook"})': {
        cacheControl: {
          maxAge: 5,
        },
        ttl: 297_475_205_000,
      },
      'organization({"login":"facebook"}).repositories({"first": 6})': {
        cacheControl: {
          maxAge: 5,
        },
        ttl: 297_475_205_000,
      },
      'organization({"login":"facebook"}).repositories({"first": 6}).edges[]': {
        cacheControl: {
          maxAge: 5,
        },
        ttl: 297_475_205_000,
      },
    },
  },
};
