import { FieldNode } from "graphql";
import { getArguments } from "..";
import { ObjectMap } from "../../../types";

export function getDirectives(field: FieldNode): ObjectMap | undefined {
  if (!field.directives || !field.directives.length) return undefined;
  const directives: ObjectMap = {};

  field.directives.forEach((directive) => {
    let args: ObjectMap = {};

    if (directive.arguments && directive.arguments.length) {
      args = getArguments(directive) || {};
    }

    directives[directive.name.value] = args;
  });

  return directives;
}
