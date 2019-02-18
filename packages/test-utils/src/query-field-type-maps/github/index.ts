import { FieldTypeMap } from "@handl/core";

export const simple: FieldTypeMap = new Map([
  ["query.organization", {
    hasArguments: true,
    hasDirectives: false,
    isEntity: true,
    typeIDValue: undefined,
    typeName: "Organization",
  }],
]);
