import { FieldTypeMap } from "@handl/core";

export const singleType: FieldTypeMap = new Map([
  ["query.organization", {
    hasArguments: true,
    hasDirectives: false,
    isEntity: true,
    typeIDValue: undefined,
    typeName: "Organization",
  }],
]);

export const nestedTypeWithEdges: FieldTypeMap = new Map([
  ["query.organization", {
    hasArguments: true,
    hasDirectives: false,
    isEntity: true,
    typeIDValue: undefined,
    typeName: "Organization",
  }],
  ["query.organization.repositories", {
    hasArguments: true,
    hasDirectives: false,
    isEntity: false,
    typeIDValue: undefined,
    typeName: "RepositoryConnection",
  }],
  ["query.organization.repositories.edges", {
    hasArguments: false,
    hasDirectives: false,
    isEntity: false,
    typeIDValue: undefined,
    typeName: "RepositoryEdge",
  }],
  ["query.organization.repositories.edges.node", {
    hasArguments: false,
    hasDirectives: false,
    isEntity: true,
    typeIDValue: undefined,
    typeName: "Repository",
  }],
]);
