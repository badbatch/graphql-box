export const getMoviePreviewQuery = {
  options: {
    variables: {
      id: "12345",
    },
  },
  request: `
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
  `,
};
