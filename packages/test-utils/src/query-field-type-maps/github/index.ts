import { FieldTypeMap } from "@handl/core";

export const singleType: FieldTypeMap = new Map([
  ["query.organization", {
    hasArguments: true,
    hasDirectives: false,
    isEntity: true,
    possibleTypeNames: [],
    typeIDValue: undefined,
    typeName: "Organization",
  }],
]);

export const nestedTypeWithEdges: FieldTypeMap = new Map([
  ["query.organization", {
    hasArguments: true,
    hasDirectives: false,
    isEntity: true,
    possibleTypeNames: [],
    typeIDValue: undefined,
    typeName: "Organization",
  }],
  ["query.organization.repositories", {
    hasArguments: true,
    hasDirectives: false,
    isEntity: false,
    possibleTypeNames: [],
    typeIDValue: undefined,
    typeName: "RepositoryConnection",
  }],
  ["query.organization.repositories.edges", {
    hasArguments: false,
    hasDirectives: false,
    isEntity: false,
    possibleTypeNames: [],
    typeIDValue: undefined,
    typeName: "RepositoryEdge",
  }],
  ["query.organization.repositories.edges.node", {
    hasArguments: false,
    hasDirectives: false,
    isEntity: true,
    possibleTypeNames: [],
    typeIDValue: undefined,
    typeName: "Repository",
  }],
  ["query.organization.repositories.edges.node.owner", {
    hasArguments: false,
    hasDirectives: false,
    isEntity: true,
    possibleTypeNames: [
      "Organization",
      "User",
    ],
    typeIDValue: undefined,
    typeName: "RepositoryOwner",
  }],
]);

export const nestedUnionWithEdges = new Map([
  ["query.search", {
    hasArguments: true,
    hasDirectives: false,
    isEntity: false,
    possibleTypeNames: [],
    typeIDValue: undefined,
    typeName: "SearchResultItemConnection",
  }],
  ["query.search.edges", {
    hasArguments: false,
    hasDirectives: false,
    isEntity: false,
    possibleTypeNames: [],
    typeIDValue: undefined,
    typeName: "SearchResultItemEdge",
  }],
  ["query.search.edges.node", {
    hasArguments: false,
    hasDirectives: false,
    isEntity: true,
    possibleTypeNames: [
      "Issue",
      "PullRequest",
      "Repository",
      "User",
      "Organization",
      "MarketplaceListing",
    ],
    typeIDValue: undefined,
    typeName: "SearchResultItem",
  }],
]);
