import { FRAGMENT_DEFINITION, getName, isKind } from "@graphql-box/helpers";
import { DocumentNode, FragmentDefinitionNode } from "graphql";
import { assign } from "lodash";

export default (ast: DocumentNode) => {
  const { definitions } = ast;

  const otherDefinitions = definitions.filter(
    definition => !isKind<FragmentDefinitionNode>(definition, FRAGMENT_DEFINITION),
  );

  const fragmentDefinitions = definitions.filter(definition =>
    isKind<FragmentDefinitionNode>(definition, FRAGMENT_DEFINITION),
  );

  fragmentDefinitions.sort((a, b) => {
    const aContents = JSON.stringify(a);
    const bContents = JSON.stringify(b);
    const aName = getName(a) as FragmentDefinitionNode["name"]["value"];
    const bName = getName(b) as FragmentDefinitionNode["name"]["value"];

    if (aContents.includes(bName)) {
      return -1;
    }

    if (bContents.includes(aName)) {
      return 1;
    }

    return 0;
  });

  assign(ast, { definitions: [...otherDefinitions, ...fragmentDefinitions] });
};
