import { PlainObjectMap, RequestOptions } from "@graphql-box/core";
import {
  DirectiveNode,
  FieldNode,
  FragmentDefinitionNode,
  FragmentSpreadNode,
  InlineFragmentNode,
  NamedTypeNode,
} from "graphql";
import { FIELD } from "../../consts";
import { ParsedDirective } from "../../defs";
import { getArguments } from "../arguments";
import { getFragmentSpreads } from "../fragment-spreads";
import { getKind, isKind } from "../kind";
import { getName } from "../name";
import { getTypeCondition } from "../type-condition";

export function getDirectives(field: FieldNode | InlineFragmentNode, options?: RequestOptions) {
  return [
    ...(isKind<FieldNode>(field, FIELD)
      ? getFieldDirectives(field, options)
      : getInlineFragmentDirectives(field, options)),
    ...getFragmentSpreadDirectives(field, options),
  ];
}

export function getFieldDirectives(field: FieldNode, options?: RequestOptions) {
  return field.directives?.length
    ? parseDirectiveArguments(field.directives, getName(field) as FieldNode["name"]["value"], getKind(field), options)
    : [];
}

export function getFragmentSpreadDirectives(
  field: FieldNode | InlineFragmentNode | FragmentDefinitionNode,
  options?: RequestOptions,
) {
  const fragmentSpreads = getFragmentSpreads(field);
  let parsedDirectives: ParsedDirective[] = [];

  if (fragmentSpreads.length) {
    parsedDirectives = fragmentSpreads.reduce((parsed: ParsedDirective[], spreadNode) => {
      if (spreadNode.directives) {
        return [
          ...parsed,
          ...parseDirectiveArguments(
            spreadNode.directives,
            getName(spreadNode) as FragmentSpreadNode["name"]["value"],
            getKind(spreadNode),
            options,
          ),
        ];
      }

      return parsed;
    }, []);
  }

  return parsedDirectives;
}

export function getInlineFragmentDirectives(field: InlineFragmentNode, options?: RequestOptions) {
  return field.directives?.length
    ? parseDirectiveArguments(
        field.directives,
        getName(getTypeCondition(field) as NamedTypeNode) as NamedTypeNode["name"]["value"],
        getKind(field),
        options,
      )
    : [];
}

export function parseDirectiveArguments(
  directives: readonly DirectiveNode[],
  name: string,
  kind: string,
  options?: RequestOptions,
) {
  return directives.reduce((parsedDirectives: ParsedDirective[], directive) => {
    let args: PlainObjectMap = {};

    if (directive.arguments && directive.arguments.length) {
      args = getArguments(directive, options) || {};
    }

    parsedDirectives.push({
      args,
      name: directive.name.value,
      parentKind: kind,
      parentName: name,
    });

    return parsedDirectives;
  }, []);
}
