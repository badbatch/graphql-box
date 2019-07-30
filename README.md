# GraphQL Box

An extensible GraphQL client and server with modules for caching, request parsing, subscriptions and more.

[![Build Status](https://travis-ci.com/badbatch/graphql-box.svg?branch=master)](https://travis-ci.com/badbatch/graphql-box)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Summary

* Simple interface for making queries, mutations and subscriptions.
* Automatically aggregate queries and mutations into fewer network requests.
* Reduce server requests with response, query path and object entity caching.
* Type level control of what gets cached using http cache-control directives.
* Save storage by automatically removing expired and infrequently accessed cache entries.
* Store cache entries using LocalStorage, IndexedDB, Redis and more.
* Export cache entries in a serializable format to be imported by another client.
* Subscriptions made simple in the browser and on the server.
* Free up the main thread by running the client in a web worker.
* Stay on top of browser and server with performance and monitoring hooks.

## Installation

GraphQL Box is structured as a [monorepo](https://github.com/lerna/lerna), so each package is published to npm under the
`@graphql-box` scope and can be installed in a project in the same way as any other npm package.

```bash
yarn add @graphql-box/<package>
```

So, for example, if you want a browser client, request parsing and a persisted cache you would install the
following packages.

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

* [Creating a browser instance of the Client](#creating-a-browser-instance-of-the-client)
* [Making a Client request for a query or mutation](#making-a-client-request-for-a-query-or-mutation)
* [Making a Client request for a subscription](#making-a-client-request-for-a-subscription)
* [Creating an instance of the Server](#creating-an-instance-of-the-server)
* [Handling a Server request for a query or mutation](#handling-a-server-request-for-a-query-or-mutation)
* [Handling a Server message for a subscription](#handling-a-server-message-for-a-subscription)

### Creating a browser instance of the Client

The `Client` is initialized using its async static `init` method, don't initialize it using the traditional class
constructor. The reason for this is so the `Client` can wait for asynchronous tasks to complete before returning an
instance of itself.

Each module you want to add to the `Client` is passed as a property into the `init` method. The default export of each
module is a curried function that returns an async function that initializes the module. This allows you and the
`Client` to pass configuration options into each module. The cache manager, request manager and request parser are all
mandatory modules. The rest are optional.

The example below initializes the `Client` with a persisted cache with type cache control directives, a debug manager
with a logger, a fetch manager with request batching enabled, and a subscriptions manager.

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

  // Do something...
})();
```

* [cacheManager](#cachemanager)
* [debugManager](#debugmanager)
* [fetchManager](#fetchmanager)
* [requestParser](#requestparser)
* [websocketManager](#websocketmanager)
* [typeIDKey](#typeidkey)

#### cacheManager

The `cacheManager` curried function returns an instance of the `CacheManager`. The `CacheManager` is a mandatory module.

Before a request is sent, the `CacheManager` takes the request AST from the `Client` and checks if any of the request
data is in one of its three caches, described below.

If all the data is in the cache and the data cache control directives are valid, the `CacheManager` returns that to
the `Client`, which returns it to the caller.

If some of the data is in its cache, the `CacheManager` returns a new request AST with only the data it does not have
and places the request data it does have in a temporary cache.

When a response comes back, the `CacheManager` stores the data against the request AST. If it already had some of the
data in its cache, the `CacheManager` merges that data with the response data and returns the result to the `Client`.

##### Cache types

The three caches are request, request field path, and data entity. The Request and request field path caches are only
used for queries, while the data entity cache is used for queries, mutations and subscriptions.

The request cache is just a request to response cache using a hash of the GraphQL query as the cache key. The request
field path cache uses the GraphQL query paths to store each piece of data within the query using a hash of each query
path as the cache key.

The data entity cache only stores data of types that have a unique identifier, referred to within GraphQL Box as a
`typeIDKey`, which default to `id`.

##### cache

The `CacheManager` uses the `@cachemap` [suite of packages](https://github.com/badbatch/cachemap) within the library
for all unit and integration tests, but you can use any module you like as long as it adheres to the interface the
`CacheManager` expects.

##### cascadeCacheControl

The concept of cascading cache control is if an entry has its own type cache control directives, these are used to
generate its cacheability, otherwise it inherits its directives from its parent. The root response data object would
inherit its directives from the response headers.

##### typeCacheDirectives

This is an object of GraphQL schema types to cache control directives, giving you fine-grained control of what gets
cached and for how long. Each time the `CacheManager` stores a type's corresponding data it looks up that type in the
`typeCacheDirectives` to find out how long it can cache the data for.

> For a full list of configuration options, see the `@graphql-box/cache-manager`
[documentation](./packages/cache-manager/README.md).

#### debugManager

The `debugManager` curried function returns an instance of the `DebugManager`. The `DebugManager` is an optional module.

The module allows you to monitor a range of events that happen within the lifecycle of a query, mutation or
subscription, including cache entries being added or queried and request execution performance.

You can track a single request from a client to the server and back through the `DebugManager` using the `boxID`. This
identifier is unique for each client request and is included in each request payload to the server and is sent back
in the response to the client.

##### logger

The `logger` is an object with a `log` function that gives you the flexibility to log data out to or send data to
wherever you want.

##### performance

`performance` is an object with a `now` function. In the browser, you should pass in `window.performance`.

> For a full list of configuration options, see the `@graphql-box/debug-manager`
[documentation](./packages/debug-manager/README.md).

#### fetchManager

In the browser, the `requestManager` property accepts the `fetchManager` curried function that return an instance of
the `FetchManager`. The `FetchManager` is a mandatory module.

The `FetchManager` takes queries and mutations from the `Client`, sends them to the server, and returns the
responses to the `Client`.

It supports batching, which, if enabled through the `batch` flag, will group requests executed within a configurable
time-frame into a single network request to the server.

> For a full list of configuration options, see the `@graphql-box/fetch-manager`
[documentation](./packages/fetch-manager/README.md).

#### requestParser

The `requestParser` curried function returns an instance of the `RequestParser`. The `RequestParser` is a
mandatory module.

The `RequestParser` takes the request string, fragments and variables from the `Client`, parses them into a request
AST, merges the fragments and variables into the AST, enriches the AST with type IDs and type names, generates metadata
to help the `CacheManager`, and returns all of that to the `Client`.

In the browser, the `RequestParser` uses the result of an introspection query of the GraphQL schema to parse
each request.

> For a full list of configuration options, see the `@graphql-box/request-parser`
[documentation](./packages/request-parser/README.md).

#### websocketManager

In the browser, the `subscriptionsManager` property accepts the `websocketManager` curried function that return an
instance of the `WebsocketManager`. The `WebsocketManager` is an optional module.

The `WebsocketManager` takes subscriptions from the `Client` and sends them to the server through a websocket. When
a subscription is resolved, the server sends the response back to the client through the websocket.

##### websocket

The `WebsocketManager` accepts an instance of a `Websocket`. Passing in the instance gives you more flexibility around
opening and closing the socket and dealing with errors. The `WebsocketManager` adds its own `onmessage` callback to the
instance.

> For a full list of configuration options, see the `@graphql-box/websocket-manager`
[documentation](./packages/websocket-manager/README.md).

#### typeIDKey

The property name that is used as the identifier for each type within the schema. This defaults to `"id"`.

### Making a Client request for a query or mutation

You can execute a query or mutation using the `request` method. Pass the request string as the first argument and
any variables or fragments as properties in the second argument.

The `request` method returns a `data` object with the response and/or an `errors` array.

```javascript
const request = `
  query ($login: String!) {
    organization(login: $login) {
      description
      email
      login
      name
      url
    }
  }
`;

(async () => {
  const { data, errors } = await client.request(request, {
    variables: { login: "facebook" },
  });

  // Do something...
})();
```

### Making a Client request for a subscription

You can execute a subscription using the `subscribe` method. Pass the request string as the first argument and
any variables or fragments as properties in the second argument.

The `subscribe` method returns an async iterator. Each time the iterator's `next` function is invokes, it returns a
`data` object with the response and/or an `errors` array.

```javascript
const subscription = `
  subscription {
    emailAdded {
      emails {
        from
        message
        subject
        unread
      }
      total
      unread
    }
  }
`;

(async () => {
  const asyncIterator = await client.subscribe(subscription);

  for await (const ({ data, errors }) of asyncIterator) {
    // Do something...
  }
})();
```

### Creating an instance of the Server

The `Server` is initialized using its async static `init` method, don't initialize it using the traditional class
constructor. The reason for this is so the `Server` can wait for asynchronous tasks to complete before returning an
instance of itself.

To initialize the `Server`, you just need to pass an instance of the `Client` into the `init` method. The difference
with the `Client` initialized in the browser example above is the `requestManager` and `subscriptionsManager` properties
accept their server-side equivalents.

The example below initializes the `Server` with a persisted cache with type cache control directives, a debug manager
with a logger, an execute module, and a subscribe module.

```javascript
import Cachemap from "@cachemap/core";
import cacheManager from "@graphql-box/cache-manager";
import Client from "@graphql-box/client";
import { DEFAULT_TYPE_ID_KEY } from "@graphql-box/core";
import debugManager from "@graphql-box/debug-manager";
import execute from "@graphql-box/execute";
import requestParser from "@graphql-box/request-parser";
import Server from "@graphql-box/server";
import subscribe from "@graphql-box/subscribe";
import { makeExecutableSchema } from "graphql-tools";
import { performance } from "perf_hooks";
import { schemaResolvers, schemaTypeDefs } from "./schema";

const schema = makeExecutableSchema({ typeDefs: schemaTypeDefs, resolvers: schemaResolvers });

(async () => {
  const server = Server.init({
    client: await Client.init({
      cacheManager: cacheManager({
        cache: await Cachemap.init({
          name: "cachemap",
          reaper: reaper({ interval: 300000 }),
          store: redis(),
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
        name: "SERVER",
        performance,
      }),
      requestManager: execute({ schema }),
      requestParser: requestParser({ schema }),
      subscriptionsManager: subscribe({ schema }),
      typeIDKey: DEFAULT_TYPE_ID_KEY,
    }),
  });

  // Do something...
})();
```

Only the `Client` properties that differ from the browser example above are outlined below.

* [debugManager:performance](#debugmanagerperformance)
* [execute](#execute)
* [requestParser:schema](#requestparserschema)
* [subscribe](#subscribe)

#### debugManager:performance

`performance` is an object with a `now` function. On the server, you should pass in `performance` object exported
from Node's `perf_hooks` module.

> For a full list of configuration options, see the `@graphql-box/debug-manager`
[documentation](./packages/debug-manager/README.md).

#### execute

On the server, the `requestManager` property accepts the `execute` curried function that return an instance of
the `Execute` module. `Execute` is a mandatory module.

`Execute` is a wrapper around GraphQL's own execute function, which resolves queries and mutations against a schema,
which needs to be passed into the curried function.

The `schema` is made up of GraphQL type definitions of each data structure and a set of resolver functions.

> For a full list of configuration options, see the `@graphql-box/execute`
[documentation](./packages/execute/README.md).

#### requestParser:schema

On the server, the `RequestParser` uses the the GraphQL schema rather than the result of an introspection query of the
schema.

> For a full list of configuration options, see the `@graphql-box/request-parser`
[documentation](./packages/request-parser/README.md).

#### subscribe

On the server, the `subscriptionsManager` property accepts the `subscribe` curried function that return an instance of
the `Subscribe` module. `Subscribe` is an optional module.

`Subscribe` is a wrapper around GraphQL's own subscribe function, which resolves subscriptions against a schema,
which needs to be passed into the curried function.

> For a full list of configuration options, see the `@graphql-box/subscribe`
[documentation](./packages/subscribe/README.md).

### Handling a Server request for a query or mutation

You can handle a query or mutation using the `request` method. The method returns a middleware function that can be
used with web application frameworks such as `Express`.

```javascript
import express from "express";
import http from "http";
import initServer from "./server";

(async () => {
  const app = express();
  const server = await initServer();
  app.use("/graphql", server.request());
  const server = http.createServer(app);
  server.listen(3001);
})();
```

### Handling a Server message for a subscription

You can handle a subscription using the `message` method. The method returns a middleware function that can be
used with websocket libraries such as `ws`.

```javascript
import express from "express";
import http from "http";
import WebSocket from "ws";
import initServer from "./server";

(async () => {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ path: "/graphql", server });

  wss.on("connection", (ws) => {
    ws.on("message", boxServer.message({ ws }));
  });
})();
```

## Changelog

Check out the [features, fixes and more](CHANGELOG.md) that go into each major, minor and patch version.

## License

GraphQL Box is [MIT Licensed](LICENSE).
