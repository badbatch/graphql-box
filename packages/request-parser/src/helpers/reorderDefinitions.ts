import { isKind } from '@graphql-box/helpers';
import { type DocumentNode, type FragmentDefinitionNode, Kind } from 'graphql';
import { assign } from 'lodash-es';

export const reorderDefinitions = (ast: DocumentNode) => {
  const { definitions } = ast;

  const otherDefinitions = definitions.filter(
    definition => !isKind<FragmentDefinitionNode>(definition, Kind.FRAGMENT_DEFINITION),
  );

  const fragmentDefinitions = definitions.filter(definition =>
    isKind<FragmentDefinitionNode>(definition, Kind.FRAGMENT_DEFINITION),
  );

  fragmentDefinitions.sort((a, b) => {
    const aContents = JSON.stringify(a);
    const bContents = JSON.stringify(b);

    if (aContents.includes(b.name.value)) {
      return -1;
    }

    if (bContents.includes(a.name.value)) {
      return 1;
    }

    return 0;
  });

  assign(ast, { definitions: [...otherDefinitions, ...fragmentDefinitions] });
};
