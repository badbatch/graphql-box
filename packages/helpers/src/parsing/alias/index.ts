import { FieldNode } from "graphql";

export function getAlias({ alias }: FieldNode): string | undefined {
  if (!alias) return undefined;
  return alias.value;
}
