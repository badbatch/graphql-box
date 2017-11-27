import { DocumentNode } from "graphql";
import getKind from "../../get-kind";

export default function hasFragmentDefinitions({ definitions }: DocumentNode): boolean {
  return definitions.some((value) => getKind(value) === "FragmentDefinition");
}
