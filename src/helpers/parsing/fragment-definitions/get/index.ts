import { DocumentNode, FragmentDefinitionNode } from "graphql";
import getKind from "../../get-kind";
import getName from "../../get-name";
import { FragmentDefinitionNodeMap } from "../../types";

export default function getFragmentDefinitions({ definitions }: DocumentNode): FragmentDefinitionNodeMap | null {
  const fragmentDefinitions: FragmentDefinitionNodeMap = {};

  definitions.forEach((value) => {
    if (getKind(value) === "FragmentDefinition") {
      fragmentDefinitions[getName(value)] = value as FragmentDefinitionNode;
    }
  });

  return Object.keys(fragmentDefinitions).length ? fragmentDefinitions : null;
}
