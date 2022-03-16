[Documentation](README.md)

# Documentation

## Index

### Classes

* [RequestParser](classes/requestparser.md)

### Interfaces

* [Ancestors](interfaces/ancestors.md)
* [ClientOptions](interfaces/clientoptions.md)
* [MapFieldToTypeData](interfaces/mapfieldtotypedata.md)
* [RequestParserDef](interfaces/requestparserdef.md)
* [UpdateRequestResult](interfaces/updaterequestresult.md)
* [UserOptions](interfaces/useroptions.md)
* [VisitorContext](interfaces/visitorcontext.md)

### Type aliases

* [ConstructorOptions](README.md#constructoroptions)
* [PersistedFragmentSpread](README.md#persistedfragmentspread)
* [RequestParserInit](README.md#requestparserinit)

### Functions

* [init](README.md#init)

### Object literals

* [getMoviePreviewQuery](README.md#const-getmoviepreviewquery)

## Type aliases

###  ConstructorOptions

Ƭ **ConstructorOptions**: *[UserOptions](interfaces/useroptions.md) & [ClientOptions](interfaces/clientoptions.md)*

*Defined in [defs/index.ts:36](https://github.com/badbatch/graphql-box/blob/54b1681/packages/request-parser/src/defs/index.ts#L36)*

___

###  PersistedFragmentSpread

Ƭ **PersistedFragmentSpread**: *[string, ParsedDirective[], ReadonlyArray‹any›]*

*Defined in [defs/index.ts:69](https://github.com/badbatch/graphql-box/blob/54b1681/packages/request-parser/src/defs/index.ts#L69)*

___

###  RequestParserInit

Ƭ **RequestParserInit**: *function*

*Defined in [defs/index.ts:47](https://github.com/badbatch/graphql-box/blob/54b1681/packages/request-parser/src/defs/index.ts#L47)*

#### Type declaration:

▸ (`options`: [ClientOptions](interfaces/clientoptions.md)): *[RequestParserDef](interfaces/requestparserdef.md)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ClientOptions](interfaces/clientoptions.md) |

## Functions

###  init

▸ **init**(`userOptions`: [UserOptions](interfaces/useroptions.md)): *[RequestParserInit](README.md#requestparserinit)*

*Defined in [main/index.ts:590](https://github.com/badbatch/graphql-box/blob/54b1681/packages/request-parser/src/main/index.ts#L590)*

**Parameters:**

Name | Type |
------ | ------ |
`userOptions` | [UserOptions](interfaces/useroptions.md) |

**Returns:** *[RequestParserInit](README.md#requestparserinit)*

## Object literals

### `Const` getMoviePreviewQuery

### ▪ **getMoviePreviewQuery**: *object*

*Defined in [__testUtils__/requestsAndOptions/index.ts:1](https://github.com/badbatch/graphql-box/blob/54b1681/packages/request-parser/src/__testUtils__/requestsAndOptions/index.ts#L1)*

###  request

• **request**: *string* = `
    query GetMoviePreview(
      $id: ID!
    ) {
      movie(id: $id) {
        backdropPath
        belongsToCollection {
          ...MovieCollection @defer(label: "MovieCollectionDefer")
        }
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
        ...MovieBackdrops @defer(label: "MovieBackdropsDefer")
        ...MovieCast @defer(label: "MovieCastDefer")
        ...MovieCrew @defer(label: "MovieCrewDefer")
        ...MovieRecommendations @defer(label: "MovieRecommendationsDefer")
        ...MovieReviews @defer(label: "MovieReviewsDefer")
        ...MovieSimilar @defer(label: "MovieSimilarDefer")
        ...MovieVideos @defer(label: "VideosDefer")
      }
    }

    fragment MovieBackdrops on Movie {
      backdrops {
        filePath
        fileType
        height
        width
      }
    }

    fragment MovieBrief on Movie {
      posterPath
      title
      voteAverage
      voteCount
      ...MovieReleaseDates @defer(label: "MovieReleaseDatesDefer")
      ...MovieVideos @defer(label: "MovieVideosDefer")
    }

    fragment MovieCollection on Collection {
      name
      overview
      parts {
        ...MovieBrief @defer(label: "MovieCollectionPartsDefer")
      }
    }

    fragment MovieCast on Movie {
      cast {
        character
        name
        profilePath
      }
    }

    fragment MovieCrew on Movie {
      crew {
        department
        gender
        job
        name
        profilePath
      }
    }

    fragment MovieRecommendations on Movie {
      recommendations(first: 10) {
        edges {
          cursor
          node {
            ...MovieBrief
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }

    fragment MovieReviews on Movie {
      reviews(first: 10) {
        edges {
          cursor
          node {
            author
            content
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }

    fragment MovieSimilar on Movie {
      similarMovies(first: 10) {
        edges {
          cursor
          node {
            ...MovieBrief
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }

    fragment MovieReleaseDates on Movie {
      releaseDates {
        releaseDates {
          certification
        }
      }
    }

    fragment MovieVideos on Movie {
      videos {
        name
        key
        site
        type
      }
    }
  `

*Defined in [__testUtils__/requestsAndOptions/index.ts:7](https://github.com/badbatch/graphql-box/blob/54b1681/packages/request-parser/src/__testUtils__/requestsAndOptions/index.ts#L7)*

▪ **options**: *object*

*Defined in [__testUtils__/requestsAndOptions/index.ts:2](https://github.com/badbatch/graphql-box/blob/54b1681/packages/request-parser/src/__testUtils__/requestsAndOptions/index.ts#L2)*

* **variables**: *object*

  * **id**: *string* = "12345"
