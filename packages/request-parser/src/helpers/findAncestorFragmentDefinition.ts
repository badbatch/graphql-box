import { FRAGMENT_DEFINITION, isKind } from "@graphql-box/helpers";
import { FragmentDefinitionNode } from "graphql";

export default (ancestors: ReadonlyArray<any>): FragmentDefinitionNode | undefined =>
  ancestors.find(ancestor => isKind<FragmentDefinitionNode>(ancestor, FRAGMENT_DEFINITION));
