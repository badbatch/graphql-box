# GraphQL Box

An extensible GraphQL client and server with modules for caching, request parsing, subscriptions and more.

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
  @cachemap/core @cachemap/reaper @cachemap/indexed-db
```

If, however, you want a server with a persisted cache that supports requests and subscriptions, you would install the
following packages.

```bash
yarn add @graphql-box/server @graphql-box/client @graphql-box/request-parser @graphql-box/cache-manager
  @graphql-box/execute @graphql-box/subscribe @cachemap/core @cachemap/reaper @cachemap/redis
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

### Creating an instance of the Client

The `Client` is initialized using its async static `init` method, don't initialize it using the traditional class
constructor. The reason for this is so the `Client` can wait for asynchronous tasks to complete before returning an
instance of itself.

Each module you want to add to the `Client` is passed as a property into the `init` method. The default export of each
module is a curried function that returns an async function that initializes the module. This allows you and the
`Client` to pass configuration options into each module. The cache manager, request manager and request parser are all
mandatory modules. The rest are optional.

The example below initializes the `Client` with a persisted cache with type cache control directives, debug manager with
a logger, fetch manager with request batching enabled, and subscriptions manager.

```javascript
import Cachemap from "@cachemap/core";
import indexedDB from "@cachemap/indexed-db";
import reaper from "@cachemap/reaper";
import cacheManager from "@graphql-box/cache-manager";
import Client from "@graphql-box/client";
import { DEFAULT_TYPE_ID_KEY } from "@graphql-box/core";
import debugManager from "@graphql-box/debug-manager";
import fetchManager from "@graphql-box/fetch-manager";
import requestParser from "@graphql-box/request-parser";
import introspection from "./introspection-query";

(async () => {
  const client = await Client.init({
    cacheManager: cacheManager({
      cache: await Cachemap.init({
        name: "cachemap",
        reaper: reaper({ interval: 300000 }),
        store: indexedDB(),
      }),
      cascadeCacheControl: true,
      typeCacheDirectives: {
        Organization: "public, max-age=3",
        Repository: "public, max-age=3",
        RepositoryConnection: "public, max-age=1",
        RepositoryOwner: "public, max-age=3",
      },
    }),
    debugManager: debugManager({
      logger: {
        log: (...args) => {
          console.log(...args);
        },
      },
      name: "CLIENT",
      performance: self.performance,
    }),
    requestManager: fetchManager({ batch: true, url: "http://localhost:3001/graphql" }),
    requestParser: requestParser({ introspection }),
    subscriptionsManager: websocketManager({ websocket: new WebSocket("ws://localhost:3001/graphql") }),
    typeIDKey: DEFAULT_TYPE_ID_KEY,
  });
})();
```

### Making a Client request for a query or mutation

// TODO

### Making a Client request for a subscription

// TODO

## Changelog

Check out the [features, fixes and more](CHANGELOG.md) that go into each major, minor and patch version.

## License

GraphQL Box is [MIT Licensed](LICENSE).
