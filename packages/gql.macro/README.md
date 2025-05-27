# @graphql-box/gql.macro

A Babel macro that takes the relative path to a `.graphql` file and replaces the function call with the content of the file at build/compile time.

Macros are a mechanism for running JavaScript functions at build-time. The value returned from these functions are directly inlined into your output.

[![npm version](https://badge.fury.io/js/%40graphql-box%2Fgql.macro.svg)](https://badge.fury.io/js/%40graphql-box%2Fgql.macro)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Installation

```bash
npm add @graphql-box/gql.macro
```

## Usage

Instructions on how to get started with Babel macros can be found [here](https://github.com/kentcdodds/babel-plugin-macros).

Once you have added Babel macros support to your build, you can import the macro and use the default export to import GraphQL queries like in the example below.

```ts
// source
import importGql from '@graphql-box/gql.macro';

const query = importGql`./src/graphql/queries/GetMovieDetails.graphql`;
```

The macro supports the GraphQL import directive and will inline any fragment imports at the bottom of the query.

```gql
#import "../fragments/MovieBackdrops.graphql"

query GetMovieDetails(
  $id: ID!
) {
  movie(id: $id) {
    backdropPath
    homepage
    overview
    popularity
    posterPath
    releaseDate
    runtime
    status
    tagline
    title
    voteAverage
    voteCount
    ...MovieBackdrops
  }
}
```

```ts
// output
// import importGql from '@graphql-box/gql.macro'; has been removed

const query = `
  query GetMovieDetails(
    $id: ID!
  ) {
    movie(id: $id) {
      backdropPath
      homepage
      overview
      popularity
      posterPath
      releaseDate
      runtime
      status
      tagline
      title
      voteAverage
      voteCount
      ...MovieBackdrops
    }
  }
  
  fragment MovieBackdrops on Movie {
    backdrops {
      aspectRadio
      filePath
      fileType
      height
      width
    }
  }
`;
```

## Alternatives

If you are looking for a non-Babel way of doing macros, check out [`@graphql-box/macros`](../macros/README.md);
