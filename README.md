# handl

An isomorphic graphql client and server with a three-tier cache and persisted storage.

[![Build Status](https://travis-ci.org/dylanaubrey/handl.svg?branch=master)](https://travis-ci.org/dylanaubrey/handl)
[![codecov](https://codecov.io/gh/dylanaubrey/handl/branch/master/graph/badge.svg)](https://codecov.io/gh/dylanaubrey/handl)
[![Quality Gate](https://sonarcloud.io/api/badges/gate?key=sonarqube:handl)](https://sonarcloud.io/dashboard?id=sonarqube%3Ahandl)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/handl.svg)](https://badge.fury.io/js/handl)
[![dependencies Status](https://david-dm.org/dylanaubrey/handl/status.svg)](https://david-dm.org/dylanaubrey/handl)
[![devDependencies Status](https://david-dm.org/dylanaubrey/handl/dev-status.svg)](https://david-dm.org/dylanaubrey/handl?type=dev)

* [Summary](#summary)
* [Installation](#installation)
* [Compilation](#compilation)
* [Documentation](#documentation)
* [Usage](#usage)

## Summary

* **Simple interface:** Make queries, mutations and subscriptions using the same method.
* **Query filtering:** Only request the data that handl does not already have in its cache.
* **Request batching:** Automatically aggregate queries and mutations into fewer requests.
* **Three-tier cache:** Reduce server requests with response, query path and object entity caching.
* **Cascading cache control:** Have fine-grained control of what gets cached using http cache-control directives.
* **Cache pruning:** Save storage by automatically removing expired and infrequently accessed cache entries.
* **Persisted storage:** Store cache entries on browser using LocalStorage and IndexedDB and on server using Redis.
* **Cache sharing:** Export cache entries in a serializable format to be imported by another handl.
* **Web worker interface:** Improve performance by running handl in a web worker.

## Installation

```bash
npm install handl --save
```

## Compilation

A couple of notes on compilation. Firstly, the `WEB_ENV` environment variable must be set when you compile your browser
bundle in order to exclude node modules. Secondly, the worker handl is currently only set up to be built with Webpack's
worker-loader via a blob URL.

## Documentation

Please read the full API documentation on the handl [github pages](https://dylanaubrey.github.io/handl).

## Usage

* [Creating a client](#creating-a-client)
* [Making queries, mutations or subscriptions](#making-queries-mutations-or-subscriptions)
* [Introspecting the schema](#introspecting-the-schema)
* [Creating a server](#creating-a-server)
* [Routing queries, mutations and subscriptions](#routing-queries-mutations-and-subscriptions)
* [Caching](#caching)

### Creating a client

Get started by creating an instance of `ClientHandl` and pass in whatever configuration options you require. The main
options are detailed in the example below. For a full list, please read the [API documentation](https://dylanaubrey.github.io/handl).

```javascript
// client-handl.js

import { ClientHandl } from 'handl';
import introspection from './introspection';

const handl = ClientHandl.create({
  // mandatory
  introspection,
  url: 'https://api.github.com/graphql',
  // optional
  batch: true,
  cachemapOptions: { use: { client: 'indexedDB', server: 'redis' } },
  defaultCacheControls: { query: 'public, max-age=60, s-maxage=60' },
  fetchTimeout: 5000,
  headers: { Authorization: 'bearer 3cdbb1ec-2189-11e8-b467-0ed5f89f718b' },
  resourceKey: 'id',
  subscriptions: { address: "ws://api.github.com/graphql" },
});

export default handl;
```

`introspection` is the output of an introspection query to the GraphQL server that handl needs to communicate with.
There are [several ways](#introspection-queries) to generate this output. Handl uses the output to assist in
parsing, filtering and caching requests and response payloads.

`url` is the endpoint that handl will use to communicate with the GraphQL server for queries and mutations.

`batch` turns on batching of query and mutation requests. It is set to `false` by default because you need to use
`ServerHandl` to receive these batched requests or write your own logic to unbatch the requests, execute them, and
then re-batch the execution results to be sent back to `ClientHandl`.

`cachemapOptions` are passed through to the [cachemap](https://github.com/dylanaubrey/cachemap) module, which is what
handl uses for its persisted storage for each cache. The main properties you may want to change from their defaults
are `use`, which allows you to specify the storage method, and `redisOptions`. which allows you to specify the
database each cache should use.

`defaultCacheControls` let you set cache-control directives for each type of operation (query, mutation, subscription).
These are used as a response's root cache-control directives in the absense of any returned in the response from
the GraphQL server.

`fetchTimeout` is the amount of time handl should wait for a response before rejecting a request. It is set to
`5000` milliseconds by default.

`headers` are any additional headers you would like sent with every request.

`resourceKey` is the name of the property thats value is used as the unique identifier for each resource/entity in
the GraphQL schema. It is set to `'id'` by default.

`subscriptions` is the configuration object passed to handl's socket manager. `address` is the only mandatory property.
If no configuration object is passed in, then subscriptions are not enabled.

### Making queries, mutations or subscriptions

Handl lets you execute queries, mutations and subscriptions anywhere in your application, so you can use it in your
service layer, Redux thunks, React higher-order components... whatever works for you. Just import the `ClientHandl` instance
you created in the above example and pass the request and any options you require into the `request` method.

* [Query](#query)
* [Mutation](#mutation)
* [Subscription](#subscription)

#### Query

```javascript
// organization-query.js

export const organization = `
  query ($login: String!, $first: Int!) {
    organization(login: $login) {
      description
      login
      name
      repositories(first: $first) {
        edges {
          node {
            ...repositoryFields
          }
        }
      }
    }
  }
`;
```

```javascript
// repository-fields-fragment.js

export const repositoryFields = `
  fragment repositoryFields on Repository {
    description
    name
  }
`;
```

```javascript
// query.js

import handl from './client-handl';
import { organization } from './organization-query';
import { repositoryFields } from './repository-fields-fragment';

(async function makeQuery() {
  try {
    const { cacheMetadata, data, queryHash } = await handl.request(organization, {
      fragments: [repositoryFields],
      variables: { login: "facebook", first: 20 },
    });

    // Do something with result...
  } catch (error) {
    // Handle error...
  }
}());
```

#### Mutation

```javascript
// add-star-mutation.js

export const addStar = `
  mutation ($input: AddStarInput!) {
    addStar(input: $input) {
      clientMutationId
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;
```

```javascript
// mutation.js

import handl from './client-handl';
import { addStar } from './add-star-mutation';

(async function makeMutation() {
  try {
    const { cacheMetadata, data } = await handl.request(addStar, {
      variables: { input: { clientMutationId: '1', starrableId: 'MDEwOlJlcG9zaXRvcnkzODMwNzQyOA==' } },
    });

    // Do something with result...
  } catch (error) {
    // Handle error...
  }
}());
```

#### Subscription

```javascript
// favourite-added-subscription.js

export const favouriteAdded = `
  subscription {
    favouriteAdded {
      count
      products {
        displayName
        longDescription
        brand
      }
    }
  }
`;
```

```javascript
// subscription.js

import { forAwaitEach } from 'iterall';
import handl from './client-handl';
import { favouriteAdded } from './favourite-added-subscription';

(async function makeSubscription() {
  try {
    const asyncIterator = await handl.request(favouriteAdded);

    forAwaitEach(asyncIterator, (result) => {
      const { cacheMetadata, data } = result;
      // Do something with result...
    });
  } catch (error) {
    // Handle error...
  }
}());
```

`fragments` are groups of fields that can be reused between queries, mutations and subscriptions. Handl will
automatically insert these into a request. Read more information about [fragments](http://graphql.org/learn/queries/#fragments).

`variables` are arguments that can be passed to fields within a request. Handl will automatically insert these into a
request. Read more information about [arguments](http://graphql.org/learn/queries/#arguments).

`cacheMetadata` is a map of query paths to their cache control directives. This metadata is used by a handl when
receiving data from another handl to allow it to cache the data correctly.

`data` is the data requested in a query, mutation or subscription.

`queryHash` is a hash of the query that was requested.

`asyncIterator` is an asynchronous iterator that gets triggerd each time a subscription result is returned. Read more
about [async iterators](https://github.com/tc39/proposal-async-iteration) and the [iterall utilities library](https://github.com/leebyron/iterall).

### Introspecting the schema

// TODO

### Creating a server

Get started by creating an instance of `ServerHandl` and pass in whatever configuration options you require. The main
options are detailed in the example below. For a full list, please read the [API documentation](https://dylanaubrey.github.io/handl).

```javascript
// server-handl.js

import { ServerHandl } from 'handl';
import schema from './graphql-schema';

const handl = ServerHandl.create({
  // mandatory
  schema,
  // optional
  cachemapOptions: { use: { server: 'redis' } },
  defaultCacheControls: { query: 'public, max-age=60, s-maxage=60' },
  resourceKey: 'id',
});

export default handl;
```

`schema` is the GraphQL schema that you want to execute queries and mutations against. It must be an instance
of `GraphQLSchema`. Read more about [creating a GraphQL schema](http://graphql.org/graphql-js/).

### Routing queries, mutations and subscriptions

#### Query and mutation requests

Requests to a server for queries and mutations can be routed using a express-compatible middleware. Just import the
`ServerHandl` instance you created in the above example and create a `requestHandler` using the `request` method, and
mount the middleware function on the path to which your GraphQL requests will be sent. The middleware will execute
the request and send the response.

#### Subscription messages

For websocket messages to a server for subscriptions, use the `message` method to create a `messageHandler`. This
function returns an event handler for the websocket's message event. The handler will create the subscription and
send the responses.

```javascript
// app.js

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import handl from './server-handl';

(async function createServer() {
  const app = express();
  const requestHandler = handl.request();
  const messageHandler = handl.message();

  app.use(cors())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use('/graphql', requestHandler);

  const server = http.createServer(app);
  const wss = new WebSocket.Server({ path: "/graphql", server });

  wss.on("connection", (ws, req) => {
    ws.on("message", messageHandler(ws));
  });

  server.listen(3000);
}());
```

### Caching

// TODO