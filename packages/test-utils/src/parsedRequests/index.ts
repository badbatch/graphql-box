import { type ParsedQuerySet } from '../types.ts';

export const singleTypeQuery = `
  {
    organization(login: "facebook") {
      description
      email
      login
      name
      url
      id
    }
  }
`;

export const singleTypeQuerySmallA = `
  {
    organization(login: "facebook") {
      description
      email
      id
    }
  }
`;

export const singleTypeQuerySmallB = `
  {
    organization(login: "facebook") {
      login
      name
      url
      id
    }
  }
`;

export const singleTypeQueryWithAlias = `
  {
    organization(login: "facebook") {
      description
      email
      login
      name: fullName
      url
      id
    }
  }
`;

export const singleTypeQueryWithDirective = `
  {
    organization(login: "facebook") {
      description
      email @include(if: true)
      login
      name
      url
      id
    }
  }
`;

export const singleTypeQueryWithInlineFragment = `
  {
    organization(login: "facebook") {
      description
      id
      ... on Organisation {
        email
        login
        name
        url
      }
    }
  }
`;

export const singleTypeQueryWithFragmentSpread = `
  {
    organization(login: "facebook") {
      description
      id
      ...OrganizationDetails
    }
  }

  fragment OrganizationDetails on Organisation {
    email
    login
    name
    url
  }
`;

export const singleTypeQuerySet: ParsedQuerySet = {
  full: singleTypeQuery,
  initial: `
    {
      organization(login: "facebook") {
        description
        login
        id
      }
    }
  `,
  updated: `
    {
      organization(login: "facebook") {
        email
        name
        url
        id
      }
    }
  `,
};

export const nestedTypeQueryBasic = `
  {
    organization(login: "facebook") {
      email
      login
      name
      repositories(first: 6) {
        edges {
          node {
            description
            homepageUrl
            name
            owner {
              url
              id
              __typename
            }
            id
          }
        }
      }
      id
    }
  }
`;

export const nestedTypeQuery = `
  {
    organization(login: "facebook") {
      description
      email
      login
      name
      repositories(first: 6) {
        edges {
          node {
            description
            homepageUrl
            name
            id
            owner {
              login
              url
              ... on Organization {
                name
                id
              }
              __typename
            }
          }
        }
      }
      url
      id
    }
  }
`;

export const nestedTypeQueryWithDirectives = `
  {
    organization(login: "facebook") {
      description
      email @include(if: true)
      login
      name
      repositories(first: 6) @skip(if: false) {
        edges {
          node {
            description
            homepageUrl
            name
            id
            owner {
              login
              url
              ... on Organization {
                name
                id
              }
              __typename
            }
          }
        }
      }
      url
      id
    }
  }
`;

export const nestedTypeQueryWithFragments = `
  {
    organization(login: "facebook") {
      ...OrganizationFields
      login
      name
      repositories(first: 6) {
        edges {
          node {
            ... on Repository {
              ...RepositoryFieldsA
              id
            }
          }
        }
      }
      url
      id
    }
  }

  fragment OrganizationFields on Organization {
    email
    description
    isVerified
    location
  }

  fragment RepositoryFieldsB on Repository {
    owner {
      login
      url
      ... on Organization {
        name
        id
      }
      __typename
    }
  }

  fragment RepositoryFieldsA on Repository {
    description
    homepageUrl
    name
    ...RepositoryFieldsB
  }
`;

export const nestedTypeQuerySet: ParsedQuerySet = {
  full: nestedTypeQuery,
  initial: `
    {
      organization(login: "facebook") {
        login
        name
        repositories(first: 6) {
          edges {
            node {
              name
              id
              owner {
                url
                ... on Organization {
                  name
                  id
                }
                __typename
              }
            }
          }
        }
        id
      }
    }
  `,
  updated: `
    {
      organization(login: "facebook") {
        description
        email
        repositories(first: 6) {
          edges {
            node {
              description
              homepageUrl
              id
            }
          }
        }
        url
        id
      }
    }
  `,
};

export const nestedUnionQuery = `
  {
    search(query: "react", first: 10, type: REPOSITORY) {
      edges {
        node {
          ... on Organization {
            description
            login
            organizationName: name
            id
          }
          ... on Issue {
            bodyText
            number
            title
            id
          }
          ... on MarketplaceListing {
            slug
            shortDescription
            howItWorks
            id
          }
          ... on PullRequest {
            bodyText
            number
            title
            id
          }
          ... on Repository {
            description
            homepageUrl
            name
            id
          }
          __typename
        }
      }
    }
  }
`;

export const nestedUnionQuerySet: ParsedQuerySet = {
  full: nestedUnionQuery,
  initial: `
    {
      search(query: "react", first: 10, type: REPOSITORY) {
        edges {
          node {
            ... on Organization {
              organizationName: name
              id
            }
            ... on Issue {
              title
              id
            }
            ... on MarketplaceListing {
              slug
              shortDescription
              id
            }
            ... on PullRequest {
              title
              id
            }
            ... on Repository {
              name
              id
            }
            __typename
          }
        }
      }
    }
  `,
  updated: `
    {
      search(query: "react", first: 10, type: REPOSITORY) {
        edges {
          node {
            ... on Repository {
              description
              homepageUrl
              id
            }
            __typename
          }
        }
      }
    }
  `,
};

export const deferQuery = `
  {
    organization(login: "facebook") {
      ...OrganizationFieldsA @defer(if: true, label: "organizationDefer")
      login
      name
      repositories(first: 10) {
        edges {
          node {
            ... on Repository @include(if: true) {
              licenseInfo {
                permissions {
                  ...PermissionsFields @defer(if: true, label: "permissionsDefer")
                }
                id
              }
              ...RepositoryFields @skip(if: false) @defer(if: true, label: "repositoryDefer")
              id
            }
          }
        }
      }
      url
      id
    }
  }

  fragment OrganizationFieldsA on Organization {
    email @include(if: true)
    description
    isVerified
    location
  }

  fragment RepositoryFields on Repository {
    description
    homepageUrl
    name
  }

  fragment PermissionsFields on LicenseRule {
    label @skip(if: false)
  }
`;

export const deferQuerySet: ParsedQuerySet = {
  full: deferQuery,
  initial: `
    {
      organization(login: "facebook") {
        ...OrganizationFieldsA @defer(if: true, label: "organizationDefer")
        name
        repositories(first: 10) {
          edges {
            node {
              ... on Repository @include(if: true) {
                licenseInfo {
                  permissions {
                    ...PermissionsFields @defer(if: true, label: "permissionsDefer")
                  }
                  id
                }
                ...RepositoryFields @skip(if: false) @defer(if: true, label: "repositoryDefer")
                id
              }
            }
          }
        }
        url
        id
      }
    }

    fragment OrganizationFieldsA on Organization {
      email @include(if: false)
      description
    }

    fragment RepositoryFields on Repository {
      description
      homepageUrl
      name
    }

    fragment PermissionsFields on LicenseRule {
      label @skip(if: true)
    }
  `,
  updated: `
    {
      organization(login: "facebook") {
        ...OrganizationFieldsA @defer(if: true, label: "organizationDefer")
        login
        repositories(first: 10) {
          edges {
            node {
              ... on Repository @include(if: true) {
                licenseInfo {
                  permissions {
                    ...PermissionsFields @defer(if: true, label: "permissionsDefer")
                  }
                  id
                }
                id
              }
            }
          }
        }
        id
      }
    }

    fragment OrganizationFieldsA on Organization {
      email @include(if: true)
      isVerified
      location
    }

    fragment PermissionsFields on LicenseRule {
      label @skip(if: false)
    }
  `,
};

export const getMoviePreviewQuery = `
  query GetMoviePreview {
    movie(id: "671") {
      backdropPath
      belongsToCollection {
        ...MovieCollection @defer(label: "MovieCollectionDefer")
        id
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
      id
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

  fragment MovieCollection on Collection {
    name
    overview
    parts {
      ...MovieBrief @defer(label: "MovieCollectionPartsDefer")
      id
    }
  }

  fragment MovieRecommendations on Movie {
    recommendations(first: 10) {
      edges {
        cursor
        node {
          posterPath
          title
          voteAverage
          voteCount
          ...MovieReleaseDates @defer(label: "MovieReleaseDatesDefer")
          ...MovieVideos @defer(label: "MovieVideosDefer")
          id
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
          posterPath
          title
          voteAverage
          voteCount
          ...MovieReleaseDates @defer(label: "MovieReleaseDatesDefer")
          ...MovieVideos @defer(label: "MovieVideosDefer")
          id
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

  fragment MovieBrief on Movie {
    posterPath
    title
    voteAverage
    voteCount
    ...MovieReleaseDates @defer(label: "MovieReleaseDatesDefer")
    ...MovieVideos @defer(label: "MovieVideosDefer")
  }

  fragment MovieCast on Movie {
    cast {
      character
      name
      profilePath
      id
    }
  }

  fragment MovieCrew on Movie {
    crew {
      department
      gender
      job
      name
      profilePath
      id
    }
  }

  fragment MovieReviews on Movie {
    reviews(first: 10) {
      edges {
        cursor
        node {
          author
          content
          id
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
      id
    }
  }
`;

export const getSearchResultsQuery = `
  query GetSearchResults {
    search(
      after: null
      before: null
      first: 20
      includeAdult: null
      last: null
      query: "harry potter"
      searchType: MULTI
    ) {
      edges {
        cursor
        node {
          ... on Movie {
            posterPath
            title
            voteAverage
            voteCount
            ...MovieReleaseDates @defer(label: "MovieReleaseDatesDefer")
            ...MovieVideos @defer(label: "MovieVideosDefer")
            id
          }
          ... on Person {
            name
            profilePath
            id
          }
          ... on Tv {
            name
            posterPath
            voteAverage
            voteCount
            ...TvContentRatings @defer(label: "TvContentRatingsDefer")
            ...TvVideos @defer(label: "TvVideosDefer")
            id
          }
          __typename
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
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
      id
    }
  }

  fragment TvContentRatings on Tv {
    contentRatings {
      rating
    }
  }

  fragment TvVideos on Tv {
    videos {
      name
      key
      site
      type
      id
    }
  }
`;

export const nestedTypeMutation = `
  mutation {
    addEmail(input: { from: "delta@gmail.com", message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit", subject: "Hi, this is Delta" }) {
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

export const nestedInterfaceMutation = `
  mutation {
    addStar(input: { clientMutationId: "1", starrableId: "MDEwOlJlcG9zaXRvcnkxMDA0NTUxNDg=" }) {
      clientMutationId
      starrable {
        viewerHasStarred
        ... on Repository {
          stargazers(first: 6) {
            edges {
              node {
                name
                login
                id
              }
            }
          }
          id
        }
        __typename
      }
    }
  }
`;

export const nestedTypeSubscription = `
  subscription {
    emailAdded {
      emails {
        from
        message
        subject
        unread
        id
      }
      total
      unread
      id
    }
  }
`;

export const nestedInterfaceSubscription = `
  subscription {
    starAdded {
      ... on Repository {
        stargazers(first: 6) {
          edges {
            node {
              name
              login
              id
            }
          }
        }
        id
      }
      __typename
    }
  }
`;
