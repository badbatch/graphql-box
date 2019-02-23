import { FieldTypeMap } from "@handl/core";

export const singleType: FieldTypeMap = new Map([
  ["query.organization", {
    hasArguments: true,
    hasDirectives: false,
    isEntity: true,
    typeIDValue: undefined,
    typeName: "Organization",
    unionTypeNames: [],
  }],
]);

export const nestedTypeWithEdges: FieldTypeMap = new Map([
  ["query.organization", {
    hasArguments: true,
    hasDirectives: false,
    isEntity: true,
    typeIDValue: undefined,
    typeName: "Organization",
    unionTypeNames: [],
  }],
  ["query.organization.repositories", {
    hasArguments: true,
    hasDirectives: false,
    isEntity: false,
    typeIDValue: undefined,
    typeName: "RepositoryConnection",
    unionTypeNames: [],
  }],
  ["query.organization.repositories.edges", {
    hasArguments: false,
    hasDirectives: false,
    isEntity: false,
    typeIDValue: undefined,
    typeName: "RepositoryEdge",
    unionTypeNames: [],
  }],
  ["query.organization.repositories.edges.node", {
    hasArguments: false,
    hasDirectives: false,
    isEntity: true,
    typeIDValue: undefined,
    typeName: "Repository",
    unionTypeNames: [],
  }],
]);

export const nestedUnionWithEdges = new Map([
  ["query.search", {
    hasArguments: true,
    hasDirectives: false,
    isEntity: false,
    typeIDValue: undefined,
    typeName: "SearchResultItemConnection",
    unionTypeNames: [],
  }],
  ["query.search.edges", {
    hasArguments: false,
    hasDirectives: false,
    isEntity: false,
    typeIDValue: undefined,
    typeName: "SearchResultItemEdge",
    unionTypeNames: [],
  }],
  ["query.search.edges.node", {
    hasArguments: false,
    hasDirectives: false,
    isEntity: true,
    typeIDValue: undefined,
    typeName: "SearchResultItem",
    unionTypeNames: [
      "Issue",
      "PullRequest",
      "Repository",
      "User",
      "Organization",
      "MarketplaceListing",
    ],
  }],
]);
