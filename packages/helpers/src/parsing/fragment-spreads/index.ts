import { FragmentDefinitionNodeMap } from "@graphql-box/core";
import {
  FieldNode,
  FragmentDefinitionNode,
  FragmentSpreadNode,
  InlineFragmentNode,
  NamedTypeNode,
  SelectionNode,
  SelectionSetNode,
} from "graphql";
import { castArray } from "lodash";
import { FIELD, FRAGMENT_SPREAD, INLINE_FRAGMENT } from "../../consts";
import { FieldAndTypeName, ParentNode } from "../../defs";
import { isKind } from "../kind";
import { getName } from "../name";

export function deleteFragmentSpreads(node: ParentNode, spreadNames: string[] | string): void {
  if (!node.selectionSet) {
    return;
  }

  const castSpreadNames = castArray(spreadNames);
  const childFields = [...node.selectionSet.selections];

  for (let i = childFields.length - 1; i >= 0; i -= 1) {
    const childField = childFields[i];

    if (isKind<FragmentSpreadNode>(childField, FRAGMENT_SPREAD)) {
      if (
        castSpreadNames.some(spreadName => spreadName === (getName(childField) as FragmentSpreadNode["name"]["value"]))
      ) {
        childFields.splice(i, 1);
      }
    } else if (isKind<InlineFragmentNode>(childField, INLINE_FRAGMENT)) {
      deleteFragmentSpreads(childField, castSpreadNames);
    }
  }

  node.selectionSet.selections = childFields;
}

export function hasFragmentSpreads({ selectionSet }: FieldNode | InlineFragmentNode | FragmentDefinitionNode): boolean {
  if (!selectionSet) return false;

  const { selections } = selectionSet;
  return selections.some(value => isKind<FragmentSpreadNode>(value, FRAGMENT_SPREAD));
}

export function getFragmentSpreads(
  fieldNode: FieldNode | InlineFragmentNode | FragmentDefinitionNode,
  { exclude = [], include = [] }: { exclude?: string[]; include?: string[] } = {},
) {
  if (!hasFragmentSpreads(fieldNode)) {
    return [];
  }

  return (fieldNode.selectionSet as SelectionSetNode).selections.filter(value => {
    const isFragmentSpread = isKind<FragmentSpreadNode>(value, FRAGMENT_SPREAD);

    if (!isFragmentSpread) {
      return false;
    }

    const isIncluded = !!include.length && include.includes(getName(value) as FragmentSpreadNode["name"]["value"]);

    const isExcluded =
      (include.length && !isIncluded) || exclude.includes(getName(value) as FragmentSpreadNode["name"]["value"]);

    return isIncluded || !isExcluded;
  }) as FragmentSpreadNode[];
}

export const getFragmentSpreadsWithoutDirectives = (node: FieldNode | InlineFragmentNode | FragmentDefinitionNode) => {
  const fragmentSpreads = getFragmentSpreads(node);

  return fragmentSpreads.reduce((withoutDirectives: FragmentSpreadNode[], spread) => {
    if (!spread.directives?.length) {
      withoutDirectives.push(spread);
    }

    return withoutDirectives;
  }, []);
};

export const resolveFragmentSpreads = (
  selectionNodes: ReadonlyArray<SelectionNode>,
  fragmentDefinitions: FragmentDefinitionNodeMap,
  maxDepth: number = 1,
  depth: number = 0,
  typeName?: string,
  fragmentKind?: string,
  fragmentName?: string,
): FieldAndTypeName[] => {
  let fieldAndTypeName: FieldAndTypeName[] = [];

  for (const selectionNode of selectionNodes) {
    if (isKind<FieldNode>(selectionNode, FIELD)) {
      fieldAndTypeName.push({ fieldNode: selectionNode, fragmentKind, fragmentName, typeName });
    } else if (isKind<FragmentSpreadNode>(selectionNode, FRAGMENT_SPREAD) && depth < maxDepth) {
      const name = getName(selectionNode) as FragmentSpreadNode["name"]["value"];
      const fragmentDefinition = fragmentDefinitions[name];

      if (fragmentDefinition) {
        const fragmentDefinitionTypeName = getName(fragmentDefinition.typeCondition) as NamedTypeNode["name"]["value"];

        const resolvedFieldAndTypeName = resolveFragmentSpreads(
          fragmentDefinition.selectionSet.selections,
          fragmentDefinitions,
          maxDepth,
          depth + 1,
          fragmentDefinitionTypeName,
          FRAGMENT_SPREAD,
          name,
        );

        fieldAndTypeName = fieldAndTypeName.concat(resolvedFieldAndTypeName);
      }
    }
  }

  return fieldAndTypeName;
};
