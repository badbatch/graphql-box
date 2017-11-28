import { DocumentNode, FragmentDefinitionNode } from "graphql";
import getKind from "../kind/get";
import getName from "../name/get";
import { FragmentDefinitionNodeMap } from "../types";

export default function getFragmentDefinitions({ definitions }: DocumentNode): FragmentDefinitionNodeMap | void {
  const fragmentDefinitions: FragmentDefinitionNodeMap = {};

  definitions.forEach((value) => {
    if (getKind(value) === "FragmentDefinition") {
      const fragmentDefinitionNode = value as FragmentDefinitionNode;
      const name = getName(fragmentDefinitionNode);
      if (!name) return;
      fragmentDefinitions[name] = fragmentDefinitionNode;
    }
  });

  if (Object.keys(fragmentDefinitions).length) {
    return fragmentDefinitions;
  }
}
