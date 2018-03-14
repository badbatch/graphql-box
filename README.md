# handl

An isomorphic GraphQL client and server with a three-tier cache and persisted storage.

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
* **Web worker interface:** Free up the main thread by running handl in a web worker.

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
* [Persisted storage](#persisted-storage)

### Creating a client

Get started by creating an instance of `ClientHandl` and pass in whatever configuration options you require. The main
options are detailed in the example below. For a full list, please read the [API documentation](https://dylanaubrey.github.io/handl).

```javascript
// client-handl.js

import { ClientHandl } from 'handl';
import introspection from './introspection';

export default async function clientHandl() {
  try {
    return ClientHandl.create({
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
  } catch (error) {
    // Handle error...
  }
}
```

`introspection` is the output of an introspection query to the GraphQL server that handl needs to communicate with.
There are [several ways](#introspecting-the-schema) to generate this output. Handl uses the output to assist in
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

import clientHandl from './client-handl';
import { organization } from './organization-query';
import { repositoryFields } from './repository-fields-fragment';

(async function makeQuery() {
  try {
    const handl = await clientHandl();

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

import clientHandl from './client-handl';
import { addStar } from './add-star-mutation';

(async function makeMutation() {
  try {
    const handl = await clientHandl();

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
import clientHandl from './client-handl';
import { favouriteAdded } from './favourite-added-subscription';

(async function makeSubscription() {
  try {
    const handl = await clientHandl();
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

export default async function serverHandl() {
  try {
    return ServerHandl.create({
      // mandatory
      schema,
      // optional
      cachemapOptions: { use: { server: 'redis' } },
      defaultCacheControls: { query: 'public, max-age=60, s-maxage=60' },
      resourceKey: 'id',
    });
  } catch (error) {
    // handle error...
  }
}
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
import serverHandl from './server-handl';

(async function startServer() {
  const app = express();
  const handl = await serverHandl();
  const requestHandler = handl.request();
  const messageHandler = handl.message();

  app.use(cors())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use('/graphql', requestHandler);

  const server = http.createServer(app);
  const wss = new WebSocket.Server({ path: '/graphql', server });

  wss.on('connection', (ws, req) => {
    ws.on('message', messageHandler(ws));
  });

  server.listen(3000);
}())
```

### Caching

* [Cascading cache control](#cascading-cache-control)
* [Single source of truth](#single-source-of-truth)
* [The Metadata type](#the-metadata-type)

Handl has three levels of caching for data returned from requests, based on whether the request was a query, mutation
or subscription. What gets cached and for how long is determined by http cache control directives. These directives
can be set as defaults in handl, in the response headers to a handl client, or in the response data generated by a
GraphQL schema.

#### Cascading cache control

Each entry in any of the three caches is assigned a cacheability through a mechanism of cascading cache
control. If an entry has its own cache control directives, these are used to generate its cacheability,
otherwise it inherits its directives from its parent. The root response data object inherits its directives from the
response headers or the handl defaults.

#### Single source of truth

Cascading cache control works with the most common use-case for GraphQL as an aggregator of REST-based microservices.
Each service will already be providing cache control directives in their responses, and this information can be mapped
into the schema object types that represent the responses' data structures and passed on to handl. This keeps a
microservice as the single source of truth for caching of its data.

#### The Metadata type

Handl provides a GraphQL object type to use for mapping cache control directives. Just create a `_metadata` field
on the object type you want to associate cache control directives with and assign the field the `type` of `MetadataType`.
In the object type's resolver, return `_metadata` as an object with a property of `cacheControl` and assign it the
cache control directives.

```javascript
// product-type.js

import { MetadataType } from 'handl';
import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  fields: () => ({
    _metadata: { type: metadataType },
    brand: { type: GraphQLString },
    description: { type: GraphQLString },
    displayName: { type: GraphQLString },
  }),
  name: 'Product',
});
```

```javascript
// query-type.js

import { GraphQLObjectType, GraphQLString } from 'graphql';
import ProductType from './product-type';

export default new GraphQLObjectType({
  fields: () => ({
    product: {
      args: { id: { type: GraphQLString } },
      resolve: async (obj, { id }) => {
        const fetchResult = await fetch(`https://product-endpoint/${id}`);
        const data = await fetchResult.json();
        const cacheControl = fetchResult.headers.get('cache-control');

        return {
          _metadata: { cacheControl },
          ...data,
        };
      },
      type: ProductType,
    },
  }),
  name: 'Query',
});
```

#### Cache tiers

##### Responses

Each query's response data is cached against a hash of the query, unless it is instructed otherwise. So any time the
same query is requested again, it will be served from the response cache, as long as the cache entry has not expired.

##### Query paths

As well as caching an entire query against its response data, handl also parses the query and breaks it down into its
'paths' and the data for each path is cached against a hash of each path. So, if handl does not find a match in the
response cache, it could still return the requested data from cache by building up a response from the query path cache.

```javascript
const parsedQuery = `
  query {
    organization(login: "facebook") {
      description
      login
      name
      repositories(first: 20) {
        edges {
          node {
            description
            name
            id
          }
        }
      }
      id
    }
  }
`;

const queryPaths = [
  'organization({login:"facebook"})',
  'organization({login:"facebook"}).repositories({first:20})',
  'organization({login:"facebook"}).repositories({first:20}).edges.node',
];
```

A query path is defined as an entity object (an object type with an ID) or a data type with arguments or directives.
The query path is stored alongside its data except for when the data is part of a sub query path. So
`organization({login:"facebook"})` would include data for the fields `description`, `login`, `name` and `id`, but not
for the field `repositories`.

##### Data entities

Data entities are the last line of handl's cache defense.

### Persisted storage

// TODO
