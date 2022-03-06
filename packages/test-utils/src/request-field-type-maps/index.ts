import { FieldTypeMap } from "@graphql-box/core";

export const singleTypeQuery: FieldTypeMap = new Map([
  [
    "query.organization",
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
      typeName: "Organization",
    },
  ],
]);

export const nestedTypeQuery: FieldTypeMap = new Map([
  [
    "query.organization",
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
      typeName: "Organization",
    },
  ],
  [
    "query.organization.repositories",
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
      typeName: "RepositoryConnection",
    },
  ],
  [
    "query.organization.repositories.edges",
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
      typeName: "RepositoryEdge",
    },
  ],
  [
    "query.organization.repositories.edges.node",
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
      typeName: "Repository",
    },
  ],
  [
    "query.organization.repositories.edges.node.owner",
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
          typeName: "Organization",
        },
        {
          isEntity: true,
          typeName: "User",
        },
      ],
      typeIDValue: undefined,
      typeName: "RepositoryOwner",
    },
  ],
]);

export const nestedUnionQuery: FieldTypeMap = new Map([
  [
    "query.search",
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
      typeName: "SearchResultItemConnection",
    },
  ],
  [
    "query.search.edges",
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
      typeName: "SearchResultItemEdge",
    },
  ],
  [
    "query.search.edges.node",
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
          typeName: "Issue",
        },
        {
          isEntity: true,
          typeName: "PullRequest",
        },
        {
          isEntity: true,
          typeName: "Repository",
        },
        {
          isEntity: true,
          typeName: "User",
        },
        {
          isEntity: true,
          typeName: "Organization",
        },
        {
          isEntity: true,
          typeName: "MarketplaceListing",
        },
      ],
      typeIDValue: undefined,
      typeName: "SearchResultItem",
    },
  ],
]);

export const deferQuery: FieldTypeMap = new Map([
  [
    "query.organization",
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
      typeName: "Organization",
    },
  ],
  [
    "query.organization.repositories",
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
      typeName: "RepositoryConnection",
    },
  ],
  [
    "query.organization.repositories.edges",
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
      typeName: "RepositoryEdge",
    },
  ],
  [
    "query.organization.repositories.edges.node",
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
      typeName: "Repository",
    },
  ],
  [
    "query.organization.repositories.edges.node.licenseInfo",
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
      typeName: "License",
    },
  ],
  [
    "query.organization.repositories.edges.node.licenseInfo.permissions",
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
      typeName: "LicenseRule",
    },
  ],
  [
    "query.organization.repositories.edges.node.licenseInfo.permissions.label",
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
      typeName: "String",
    },
  ],
  [
    "query.organization.repositories.edges.node.id",
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
      typeName: "ID",
    },
  ],
  [
    "query.organization.email",
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
      typeName: "String",
    },
  ],
  [
    "query.organization.description",
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
      typeName: "String",
    },
  ],
  [
    "query.organization.isVerified",
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
      typeName: "Boolean",
    },
  ],
  [
    "query.organization.location",
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
      typeName: "String",
    },
  ],
  [
    "query.organization.repositories.edges.node.description",
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
      typeName: "String",
    },
  ],
  [
    "query.organization.repositories.edges.node.homepageUrl",
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
      typeName: "URI",
    },
  ],
  [
    "query.organization.repositories.edges.node.name",
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
      typeName: "String",
    },
  ],
]);

export const nestedInterfaceMutation: FieldTypeMap = new Map([
  [
    "mutation.addStar",
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
      typeName: "AddStarPayload",
    },
  ],
  [
    "mutation.addStar.starrable",
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
          typeName: "Repository",
        },
        {
          isEntity: true,
          typeName: "Topic",
        },
        {
          isEntity: true,
          typeName: "Gist",
        },
      ],
      typeIDValue: undefined,
      typeName: "Starrable",
    },
  ],
  [
    "mutation.addStar.starrable.stargazers",
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
      typeName: "StargazerConnection",
    },
  ],
  [
    "mutation.addStar.starrable.stargazers.edges",
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
      typeName: "StargazerEdge",
    },
  ],
  [
    "mutation.addStar.starrable.stargazers.edges.node",
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
      typeName: "User",
    },
  ],
]);

export const nestedTypeSubscription: FieldTypeMap = new Map([
  [
    "subscription.emailAdded",
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
      typeName: "Inbox",
    },
  ],
  [
    "subscription.emailAdded.emails",
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
      typeName: "Email",
    },
  ],
]);
