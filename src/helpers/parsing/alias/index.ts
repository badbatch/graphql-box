import { FieldNode } from "graphql";

export function getAlias({ alias }: FieldNode): string | void {
  if (!alias) return;
  return alias.value;
}
