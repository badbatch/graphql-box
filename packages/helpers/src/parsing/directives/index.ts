import { coreDefs } from "@handl/core";
import { FieldNode } from "graphql";
import { getArguments } from "../arguments";

export function getDirectives(field: FieldNode): coreDefs.PlainObjectMap | undefined {
  if (!field.directives || !field.directives.length) return undefined;

  const directives: coreDefs.PlainObjectMap = {};

  field.directives.forEach((directive) => {
    let args: coreDefs.PlainObjectMap = {};

    if (directive.arguments && directive.arguments.length) {
      args = getArguments(directive) || {};
    }

    directives[directive.name.value] = args;
  });

  return directives;
}
