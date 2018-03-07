# handl

An isomorphic graphql client and server with a three-tier cache and persisted storage.

[![Build Status](https://travis-ci.org/dylanaubrey/handl.svg?branch=master)](https://travis-ci.org/dylanaubrey/handl)
[![codecov](https://codecov.io/gh/dylanaubrey/handl/branch/master/graph/badge.svg)](https://codecov.io/gh/dylanaubrey/handl)
[![Quality Gate](https://sonarcloud.io/api/badges/gate?key=sonarqube:handl)](https://sonarcloud.io/dashboard?id=sonarqube%3Ahandl)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/handl.svg)](https://badge.fury.io/js/handl)
[![dependencies Status](https://david-dm.org/dylanaubrey/handl/status.svg)](https://david-dm.org/dylanaubrey/handl)
[![devDependencies Status](https://david-dm.org/dylanaubrey/handl/dev-status.svg)](https://david-dm.org/dylanaubrey/handl?type=dev)

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

### Creating a client

Get started by creating an instance of `ClientHandl` and pass in whatever configuration options you require. The main
options are detailed in the example below. For a full list, please read the [API documentation](https://dylanaubrey.github.io/handl).

```javascript
// handl.js

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

### Making a query

Handl lets you execute queries, mutations and subscriptions anywhere in your application, so you can use it in your
service layer, Redux thunks, React higher-order components... whatever works for you. Just import the handl instance
you created in the above example and pass the request and any options you require into handl's `request` method.

```javascript
// query.js

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
// fragment.js

export const repositoryFields = `
  fragment repositoryFields on Repository {
    description
    name
  }
`;
```

```javascript
// request.js

import handl from './handl';
import { organization } from './query';
import { repositoryFields } from './fragment';

(async function makeRequest() {
  try {
    const { cacheMetadata, data, queryHash } = await client.request(query, {
      fragments: [repositoryFields],
      variables: { login: "facebook", first: 20 },
    });

    // Do something with result...
  } catch (error) {
    // Handle error...
  }
}());
```

`fragments` ...

`variables` ...

`cacheMetadata` ...

`data` ...

`queryHash` ...

### Introspecting the schema
