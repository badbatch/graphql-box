# GraphQL Box

An extensible, isomorphic GraphQL client and server with modules for caching, request parsing, subscriptions and more.

[![Build Status](https://travis-ci.org/badbatch/graphql-box.svg?branch=master)](https://travis-ci.org/badbatch/graphql-box)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Summary

* Simple interface for making queries, mutations and subscriptions.
* Automatically aggregate queries and mutations into fewer network requests.
* Reduce server requests with response, query path and object entity caching.
* Type level control of what gets cached using http cache-control directives.
* Save storage by automatically removing expired and infrequently accessed cache entries.
* Store cache entries using LocalStorage, IndexedDB, Redis and more.
* Export cache entries in a serializable format to be imported by another client.
* Subscriptions made simple on the client and server.
* Free up the main thread by running the client in a web worker.
* Stay on top of client and server with performance and monitoring hooks.

## Installation

GraphQL Box is structured as a [monorepo](https://github.com/lerna/lerna), so each package is published to npm under the
`@graphql-box` scope and can be installed in a project in the same way as any other npm package.

```bash
yarn add @graphql-box/<package>
```

So, for example, if you want a client, request parsing and a persisted cache you would install the following packages.

```bash
yarn add @graphql-box/client @graphql-box/request-parser @graphql-box/cache-manager @graphql-box/fetch-manager
```

If, however, you want a server with a persisted cache that supports requests and subscriptions, you would install the
following packages.

```bash
yarn add @graphql-box/server @graphql-box/client @graphql-box/request-parser @graphql-box/cache-manager
  @graphql-box/execute @graphql-box/subscribe
```

## Packages

GraphQL Box's multi-package structure allows you to compose your client and server of the modules you need, without
additional bloat. Start with the `@graphql-box/client` or `@graphql-box/server` packages and build out from there.

* [@graphql-box/cache-manager](packages/cache-manager)
* [@graphql-box/cli](packages/cli)
* [@graphql-box/client](packages/client)
* [@graphql-box/core](packages/core)
* [@graphql-box/debug-manager](packages/debug-manager)
* [@graphql-box/execute](packages/execute)
* [@graphql-box/fetch-manager](packages/fetch-manager)
* [@graphql-box/helpers](packages/helpers)
* [@graphql-box/request-parser](packages/request-parser)
* [@graphql-box/server](packages/server)
* [@graphql-box/subscribe](packages/subscribe)
* [@graphql-box/test-utils](packages/test-utils)
* [@graphql-box/websocket-manager](packages/websocket-manager)
* [@graphql-box/worker-client](packages/worker-client)

## Usage

// TODO

## Changelog

Check out the [features, fixes and more](CHANGELOG.md) that go into each major, minor and patch version.

## License

GraphQL Box is [MIT Licensed](LICENSE).
