import { FieldTypeMap } from "@handl/core";

export const singleType: FieldTypeMap = new Map([
  ["query.organization", {
    hasArguments: true,
    hasDirectives: false,
    isEntity: true,
    possibleTypes: [],
    typeIDValue: undefined,
    typeName: "Organization",
  }],
]);

export const nestedTypeWithEdges: FieldTypeMap = new Map([
  ["query.organization", {
    hasArguments: true,
    hasDirectives: false,
    isEntity: true,
    possibleTypes: [],
    typeIDValue: undefined,
    typeName: "Organization",
  }],
  ["query.organization.repositories", {
    hasArguments: true,
    hasDirectives: false,
    isEntity: false,
    possibleTypes: [],
    typeIDValue: undefined,
    typeName: "RepositoryConnection",
  }],
  ["query.organization.repositories.edges", {
    hasArguments: false,
    hasDirectives: false,
    isEntity: false,
    possibleTypes: [],
    typeIDValue: undefined,
    typeName: "RepositoryEdge",
  }],
  ["query.organization.repositories.edges.node", {
    hasArguments: false,
    hasDirectives: false,
    isEntity: true,
    possibleTypes: [],
    typeIDValue: undefined,
    typeName: "Repository",
  }],
  ["query.organization.repositories.edges.node.owner", {
    hasArguments: false,
    hasDirectives: false,
    isEntity: true,
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
  }],
]);

export const nestedUnionWithEdges: FieldTypeMap = new Map([
  ["query.search", {
    hasArguments: true,
    hasDirectives: false,
    isEntity: false,
    possibleTypes: [],
    typeIDValue: undefined,
    typeName: "SearchResultItemConnection",
  }],
  ["query.search.edges", {
    hasArguments: false,
    hasDirectives: false,
    isEntity: false,
    possibleTypes: [],
    typeIDValue: undefined,
    typeName: "SearchResultItemEdge",
  }],
  ["query.search.edges.node", {
    hasArguments: false,
    hasDirectives: false,
    isEntity: false,
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
  }],
]);
