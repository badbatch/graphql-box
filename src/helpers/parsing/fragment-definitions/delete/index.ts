import { DocumentNode } from "graphql";
import getKind from "../../get-kind";

export default function deleteFragmentDefinitions({ definitions }: DocumentNode): void {
  for (let i = definitions.length - 1; i >= 0; i -= 1) {
    if (getKind(definitions[i]) === "FragmentDefinition") {
      definitions.splice(i, 1);
    }
  }
}
