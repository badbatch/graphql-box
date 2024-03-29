import { type FieldTypeMap } from '@graphql-box/core';

export const singleTypeQuery: FieldTypeMap = new Map([
  [
    'query.organization',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: true,
      hasDirectives: false,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Organization',
    },
  ],
]);

export const singleTypeQueryWithDirective: FieldTypeMap = new Map([
  [
    'query.organization',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: true,
      hasDirectives: false,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Organization',
    },
  ],
  [
    'query.organization.email',
    {
      directives: {
        inherited: [],
        own: ['include({"if":true})'],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'String',
    },
  ],
]);

export const nestedTypeQuery: FieldTypeMap = new Map([
  [
    'query.organization',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: true,
      hasDirectives: false,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Organization',
    },
  ],
  [
    'query.organization.repositories',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: true,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'RepositoryConnection',
    },
  ],
  [
    'query.organization.repositories.edges',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'RepositoryEdge',
    },
  ],
  [
    'query.organization.repositories.edges.node',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Repository',
    },
  ],
  [
    'query.organization.repositories.edges.node.owner',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: true,
      isInterface: true,
      isUnion: false,
      possibleTypes: [
        {
          isEntity: true,
          typeName: 'Organization',
        },
        {
          isEntity: true,
          typeName: 'User',
        },
      ],
      typeIDValue: undefined,
      typeName: 'RepositoryOwner',
    },
  ],
]);

export const nestedTypeQueryWithDirectives: FieldTypeMap = new Map([
  [
    'query.organization',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: true,
      hasDirectives: false,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Organization',
    },
  ],
  [
    'query.organization.email',
    {
      directives: {
        inherited: [],
        own: ['include({"if":true})'],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'String',
    },
  ],
  [
    'query.organization.repositories',
    {
      directives: {
        inherited: [],
        own: ['skip({"if":false})'],
      },
      hasArguments: true,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'RepositoryConnection',
    },
  ],
  [
    'query.organization.repositories.edges',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'RepositoryEdge',
    },
  ],
  [
    'query.organization.repositories.edges.node',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Repository',
    },
  ],
  [
    'query.organization.repositories.edges.node.owner',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: true,
      isInterface: true,
      isUnion: false,
      possibleTypes: [
        {
          isEntity: true,
          typeName: 'Organization',
        },
        {
          isEntity: true,
          typeName: 'User',
        },
      ],
      typeIDValue: undefined,
      typeName: 'RepositoryOwner',
    },
  ],
]);

export const nestedUnionQuery: FieldTypeMap = new Map([
  [
    'query.search',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: true,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'SearchResultItemConnection',
    },
  ],
  [
    'query.search.edges',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'SearchResultItemEdge',
    },
  ],
  [
    'query.search.edges.node',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: true,
      possibleTypes: [
        {
          isEntity: true,
          typeName: 'Issue',
        },
        {
          isEntity: true,
          typeName: 'PullRequest',
        },
        {
          isEntity: true,
          typeName: 'Repository',
        },
        {
          isEntity: true,
          typeName: 'User',
        },
        {
          isEntity: true,
          typeName: 'Organization',
        },
        {
          isEntity: true,
          typeName: 'MarketplaceListing',
        },
      ],
      typeIDValue: undefined,
      typeName: 'SearchResultItem',
    },
  ],
]);

export const deferQuery: FieldTypeMap = new Map([
  [
    'query.organization',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: true,
      hasDirectives: false,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Organization',
    },
  ],
  [
    'query.organization.repositories',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: true,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'RepositoryConnection',
    },
  ],
  [
    'query.organization.repositories.edges',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'RepositoryEdge',
    },
  ],
  [
    'query.organization.repositories.edges.node',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Repository',
    },
  ],
  [
    'query.organization.repositories.edges.node.licenseInfo',
    {
      directives: {
        inherited: ['include({"if":true})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'License',
    },
  ],
  [
    'query.organization.repositories.edges.node.licenseInfo.permissions',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'LicenseRule',
    },
  ],
  [
    'query.organization.repositories.edges.node.licenseInfo.permissions.label',
    {
      directives: {
        inherited: ['defer({"if":true,"label":"permissionsDefer"})'],
        own: ['skip({"if":false})'],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'String',
    },
  ],
  [
    'query.organization.repositories.edges.node.id',
    {
      directives: {
        inherited: ['include({"if":true})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'ID',
    },
  ],
  [
    'query.organization.email',
    {
      directives: {
        inherited: ['defer({"if":true,"label":"organizationDefer"})'],
        own: ['include({"if":true})'],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'String',
    },
  ],
  [
    'query.organization.description',
    {
      directives: {
        inherited: ['defer({"if":true,"label":"organizationDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'String',
    },
  ],
  [
    'query.organization.isVerified',
    {
      directives: {
        inherited: ['defer({"if":true,"label":"organizationDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Boolean',
    },
  ],
  [
    'query.organization.location',
    {
      directives: {
        inherited: ['defer({"if":true,"label":"organizationDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'String',
    },
  ],
  [
    'query.organization.repositories.edges.node.description',
    {
      directives: {
        inherited: ['include({"if":true})', 'skip({"if":false})', 'defer({"if":true,"label":"repositoryDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'String',
    },
  ],
  [
    'query.organization.repositories.edges.node.homepageUrl',
    {
      directives: {
        inherited: ['include({"if":true})', 'skip({"if":false})', 'defer({"if":true,"label":"repositoryDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'URI',
    },
  ],
  [
    'query.organization.repositories.edges.node.name',
    {
      directives: {
        inherited: ['include({"if":true})', 'skip({"if":false})', 'defer({"if":true,"label":"repositoryDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'String',
    },
  ],
]);

export const getSearchResultsQuery: FieldTypeMap = new Map([
  [
    'query.search',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: true,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeName: 'SearchConnection',
    },
  ],
  [
    'query.search.edges',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeName: 'SearchEdge',
    },
  ],
  [
    'query.search.edges.node',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: true,
      possibleTypes: [
        {
          isEntity: true,
          typeName: 'Collection',
        },
        {
          isEntity: true,
          typeName: 'Company',
        },
        {
          isEntity: true,
          typeName: 'Keyword',
        },
        {
          isEntity: true,
          typeName: 'Movie',
        },
        {
          isEntity: true,
          typeName: 'Person',
        },
        {
          isEntity: true,
          typeName: 'Tv',
        },
      ],
      typeName: 'Search',
    },
  ],
  [
    'query.search.edges.node.contentRatings',
    {
      directives: {
        inherited: ['defer({"label":"TvContentRatingsDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeName: 'ContentRating',
    },
  ],
  [
    'query.search.edges.node.releaseDates',
    {
      directives: {
        inherited: ['defer({"label":"MovieReleaseDatesDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeName: 'ReleaseDates',
    },
  ],
  [
    'query.search.edges.node.releaseDates.releaseDates',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeName: 'ReleaseDate',
    },
  ],
  [
    'query.search.edges.node.videos',
    {
      directives: {
        inherited: ['defer({"label":"TvVideosDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeName: 'Video',
    },
  ],
  [
    'query.search.pageInfo',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeName: 'PageInfo',
    },
  ],
]);

export const getMoviePreviewQuery: FieldTypeMap = new Map([
  [
    'query.movie',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: true,
      hasDirectives: false,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: '671',
      typeName: 'Movie',
    },
  ],
  [
    'query.movie.backdrops',
    {
      directives: {
        inherited: ['defer({"label":"MovieBackdropsDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Image',
    },
  ],
  [
    'query.movie.belongsToCollection',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Collection',
    },
  ],
  [
    'query.movie.belongsToCollection.name',
    {
      directives: {
        inherited: ['defer({"label":"MovieCollectionDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'String',
    },
  ],
  [
    'query.movie.belongsToCollection.overview',
    {
      directives: {
        inherited: ['defer({"label":"MovieCollectionDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'String',
    },
  ],
  [
    'query.movie.belongsToCollection.parts',
    {
      directives: {
        inherited: ['defer({"label":"MovieCollectionDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Movie',
    },
  ],
  [
    'query.movie.belongsToCollection.parts.posterPath',
    {
      directives: {
        inherited: ['defer({"label":"MovieCollectionPartsDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'String',
    },
  ],
  [
    'query.movie.belongsToCollection.parts.releaseDates',
    {
      directives: {
        inherited: ['defer({"label":"MovieReleaseDatesDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'ReleaseDates',
    },
  ],
  [
    'query.movie.belongsToCollection.parts.releaseDates.releaseDates',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'ReleaseDate',
    },
  ],
  [
    'query.movie.belongsToCollection.parts.title',
    {
      directives: {
        inherited: ['defer({"label":"MovieCollectionPartsDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'String',
    },
  ],
  [
    'query.movie.belongsToCollection.parts.videos',
    {
      directives: {
        inherited: ['defer({"label":"MovieVideosDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Video',
    },
  ],
  [
    'query.movie.belongsToCollection.parts.voteAverage',
    {
      directives: {
        inherited: ['defer({"label":"MovieCollectionPartsDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Float',
    },
  ],
  [
    'query.movie.belongsToCollection.parts.voteCount',
    {
      directives: {
        inherited: ['defer({"label":"MovieCollectionPartsDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Int',
    },
  ],
  [
    'query.movie.cast',
    {
      directives: {
        inherited: ['defer({"label":"MovieCastDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Cast',
    },
  ],
  [
    'query.movie.crew',
    {
      directives: {
        inherited: ['defer({"label":"MovieCrewDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Crew',
    },
  ],
  [
    'query.movie.recommendations',
    {
      directives: {
        inherited: ['defer({"label":"MovieRecommendationsDefer"})'],
        own: [],
      },
      hasArguments: true,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: '671',
      typeName: 'MovieConnection',
    },
  ],
  [
    'query.movie.recommendations.edges',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'MovieEdge',
    },
  ],
  [
    'query.movie.recommendations.edges.node',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Movie',
    },
  ],
  [
    'query.movie.recommendations.edges.node.releaseDates',
    {
      directives: {
        inherited: ['defer({"label":"MovieReleaseDatesDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'ReleaseDates',
    },
  ],
  [
    'query.movie.recommendations.edges.node.releaseDates.releaseDates',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'ReleaseDate',
    },
  ],
  [
    'query.movie.recommendations.edges.node.videos',
    {
      directives: {
        inherited: ['defer({"label":"MovieVideosDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Video',
    },
  ],
  [
    'query.movie.recommendations.pageInfo',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'PageInfo',
    },
  ],
  [
    'query.movie.reviews',
    {
      directives: {
        inherited: ['defer({"label":"MovieReviewsDefer"})'],
        own: [],
      },
      hasArguments: true,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: '671',
      typeName: 'ReviewConnection',
    },
  ],
  [
    'query.movie.reviews.edges',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'ReviewEdge',
    },
  ],
  [
    'query.movie.reviews.edges.node',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Review',
    },
  ],
  [
    'query.movie.reviews.pageInfo',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'PageInfo',
    },
  ],
  [
    'query.movie.similarMovies',
    {
      directives: {
        inherited: ['defer({"label":"MovieSimilarDefer"})'],
        own: [],
      },
      hasArguments: true,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: '671',
      typeName: 'MovieConnection',
    },
  ],
  [
    'query.movie.similarMovies.edges',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'MovieEdge',
    },
  ],
  [
    'query.movie.similarMovies.edges.node',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Movie',
    },
  ],
  [
    'query.movie.similarMovies.edges.node.releaseDates',
    {
      directives: {
        inherited: ['defer({"label":"MovieReleaseDatesDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'ReleaseDates',
    },
  ],
  [
    'query.movie.similarMovies.edges.node.releaseDates.releaseDates',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'ReleaseDate',
    },
  ],
  [
    'query.movie.similarMovies.edges.node.videos',
    {
      directives: {
        inherited: ['defer({"label":"MovieVideosDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Video',
    },
  ],
  [
    'query.movie.similarMovies.pageInfo',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'PageInfo',
    },
  ],
  [
    'query.movie.videos',
    {
      directives: {
        inherited: ['defer({"label":"VideosDefer"})'],
        own: [],
      },
      hasArguments: false,
      hasDirectives: true,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Video',
    },
  ],
]);

export const nestedInterfaceMutation: FieldTypeMap = new Map([
  [
    'mutation.addStar',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: true,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'AddStarPayload',
    },
  ],
  [
    'mutation.addStar.starrable',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: true,
      isInterface: true,
      isUnion: false,
      possibleTypes: [
        {
          isEntity: true,
          typeName: 'Repository',
        },
        {
          isEntity: true,
          typeName: 'Topic',
        },
        {
          isEntity: true,
          typeName: 'Gist',
        },
      ],
      typeIDValue: undefined,
      typeName: 'Starrable',
    },
  ],
  [
    'mutation.addStar.starrable.stargazers',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: true,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'StargazerConnection',
    },
  ],
  [
    'mutation.addStar.starrable.stargazers.edges',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: false,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'StargazerEdge',
    },
  ],
  [
    'mutation.addStar.starrable.stargazers.edges.node',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'User',
    },
  ],
]);

export const nestedTypeSubscription: FieldTypeMap = new Map([
  [
    'subscription.emailAdded',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Inbox',
    },
  ],
  [
    'subscription.emailAdded.emails',
    {
      directives: {
        inherited: [],
        own: [],
      },
      hasArguments: false,
      hasDirectives: false,
      isEntity: true,
      isInterface: false,
      isUnion: false,
      possibleTypes: [],
      typeIDValue: undefined,
      typeName: 'Email',
    },
  ],
]);
