# macros

A library of macros for use with GraphQL Box.

[![npm version](https://badge.fury.io/js/%40graphql-box%2Fmacros.svg)](https://badge.fury.io/js/%40graphql-box%2Fmacros)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

All the functions exported from this package are intended to be imported with the `with { type: 'macro' }` import attribute in conjunction with the use of the `unplugin-macros` [plugin](https://github.com/unplugin/unplugin-macros) or a compiler/bundler that supports the macros import attribute such as [Bun](https://bun.sh/) or [Parcel](https://parceljs.org/).

Macros are a mechanism for running JavaScript functions at bundle-time. The value returned from these functions are directly inlined into your bundle.

## Installation

```bash
npm add @graphql-box/macros
```

## Usage

### importGql

This macro takes either an absolute path or path relative to the current working directory and returns the content of the `.graphql` file at that path. The macro supports the GraphQL import directive and will inline any fragment imports at the bottom of the file.

Import the `importGql` macro from `@graphql-box/macros` and pass in path to the GraphQL query you want to import.

```ts
import { importGql } from '@graphql-box/macros' with { type: 'macro' };

const GET_MOVIE_DETAILS = importGql('./src/graphql/queries/GetMovieDetails.graphql');
```

The `GetMovieDetails.graphql` file might look something like the example below.

```gql
#import "../fragments/MovieBackdrops.graphql"
#import "../fragments/MovieCastAndCrew.graphql"
#import "../fragments/MovieCertifications.graphql"
#import "../fragments/MovieCollection.graphql"
#import "../fragments/MovieListings.graphql"
#import "../fragments/MovieReviewsTotal.graphql"
#import "../fragments/MovieVideos.graphql"
#import "../fragments/MovieWatchProviders.graphql"

query GetMovieDetails(
    $id: ID!
) {
    movie(id: $id) {
        backdropPath
        genres {
            name
        }
        homepage
        overview
        popularity
        posterPath
        recommendations (
            first: 10,
        ) {
            ...MovieListings
        }
        releaseDate
        runtime
        similarMovies (
            first: 10,
        ) {
            ...MovieListings
        }
        status
        tagline
        title
        voteAverage
        voteCount
        ...MovieBackdrops
        ...MovieCastAndCrew
        ...MovieCertifications
        ...MovieCollection
        ...MovieReviewsTotal
        ...MovieVideos
        ...MovieWatchProviders
    }
}
```

Then run your compiler and inspect the output. You should see `importGql('./src/graphql/queries/GetMovieDetails.graphql')` replaced with the content of the `.graphql` file.
