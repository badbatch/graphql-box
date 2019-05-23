import { PlainObjectMap } from "@graphql-box/core";
import { FieldNode } from "graphql";
import { getArguments } from "../arguments";

export function getDirectives(field: FieldNode): PlainObjectMap | undefined {
  if (!field.directives || !field.directives.length) return undefined;

  const directives: PlainObjectMap = {};

  field.directives.forEach((directive) => {
    let args: PlainObjectMap = {};

    if (directive.arguments && directive.arguments.length) {
      args = getArguments(directive) || {};
    }

    directives[directive.name.value] = args;
  });

  return directives;
}
