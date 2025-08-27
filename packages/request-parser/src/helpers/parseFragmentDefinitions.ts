import { type FragmentDefinitionNodeMap, type PlainObject } from '@graphql-box/core';
import { getFragmentDefinitions } from '@graphql-box/helpers';
import { type DocumentNode } from 'graphql';
import { type Jsonifiable } from 'type-fest';
import { replaceFragmentSpreadsWithDefinitionFields } from '#helpers/replaceFragmentSpreadsWithDefinitionFields.ts';
import { type VariableTypesMap } from '#types.ts';

export const parseFragmentDefinitions = (
  ast: DocumentNode,
  variableTypes: VariableTypesMap,
  variableValues: PlainObject<Jsonifiable>,
): FragmentDefinitionNodeMap => {
  const fragmentDefinitions: FragmentDefinitionNodeMap = {
    ...getFragmentDefinitions(ast),
  };

  for (const [name, fragmentDefinition] of Object.entries(fragmentDefinitions)) {
    fragmentDefinitions[name] = replaceFragmentSpreadsWithDefinitionFields(
      fragmentDefinition,
      fragmentDefinitions,
      variableTypes,
      variableValues,
    );
  }

  return fragmentDefinitions;
};
