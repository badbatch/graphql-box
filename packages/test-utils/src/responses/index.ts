import { type ResponseData } from '@graphql-box/core';

export const facebookQuery: ResponseData = {
  data: {
    organization: {
      email: '',
      id: 'MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
      login: 'facebook',
      name: 'Facebook',
    },
  },
  extensions: {
    cacheMetadata: {
      'organization.email': {
        cacheControl: {
          maxAge: 5,
        },
        etag: undefined,
        ttl: 297_475_205_000,
      },
      'organization.id': {
        cacheControl: {
          maxAge: 5,
        },
        etag: undefined,
        ttl: 297_475_205_000,
      },
      'organization.login': {
        cacheControl: {
          maxAge: 5,
        },
        etag: undefined,
        ttl: 297_475_205_000,
      },
      'organization.name': {
        cacheControl: {
          maxAge: 5,
        },
        etag: undefined,
        ttl: 297_475_205_000,
      },
    },
  },
};

export const googleQuery: ResponseData = {
  data: {
    organization: {
      email: '',
      id: 'MDEyOk9yZ2FuaXphdGlvbjEzNDIwMDQ=',
      login: 'google',
      name: 'Google',
    },
  },
  extensions: {
    cacheMetadata: {
      'organization.email': {
        cacheControl: {
          maxAge: 5,
        },
        etag: undefined,
        ttl: 297_475_205_000,
      },
      'organization.id': {
        cacheControl: {
          maxAge: 5,
        },
        etag: undefined,
        ttl: 297_475_205_000,
      },
      'organization.login': {
        cacheControl: {
          maxAge: 5,
        },
        etag: undefined,
        ttl: 297_475_205_000,
      },
      'organization.name': {
        cacheControl: {
          maxAge: 5,
        },
        etag: undefined,
        ttl: 297_475_205_000,
      },
    },
  },
};
