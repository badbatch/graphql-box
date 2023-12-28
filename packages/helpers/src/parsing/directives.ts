import { type PlainObject, type RequestOptions } from '@graphql-box/core';
import {
  type DirectiveNode,
  type FieldNode,
  type FragmentDefinitionNode,
  type InlineFragmentNode,
  Kind,
} from 'graphql';
import { type ParsedDirective } from '../types.ts';
import { getArguments } from './arguments.ts';
import { getFragmentSpreads } from './fragmentSpreads.ts';
import { getKind, isKind } from './kind.ts';
import { getName } from './name.ts';
import { getTypeCondition } from './typeCondition.ts';

export const getDirectives = (field: FieldNode | InlineFragmentNode, options?: RequestOptions) => {
  return [
    ...(isKind<FieldNode>(field, Kind.FIELD)
      ? getFieldDirectives(field, options)
      : getInlineFragmentDirectives(field, options)),
    ...getFragmentSpreadDirectives(field, options),
  ];
};

export const getFieldDirectives = (field: FieldNode, options?: RequestOptions) => {
  return field.directives?.length
    ? parseDirectiveArguments(field.directives, getName(field)!, getKind(field), options)
    : [];
};

export const getFragmentSpreadDirectives = (
  field: FieldNode | InlineFragmentNode | FragmentDefinitionNode,
  options?: RequestOptions
) => {
  const fragmentSpreads = getFragmentSpreads(field);
  let parsedDirectives: ParsedDirective[] = [];

  if (fragmentSpreads.length > 0) {
    parsedDirectives = fragmentSpreads.reduce<ParsedDirective[]>((parsed, spreadNode) => {
      if (spreadNode.directives) {
        return [
          ...parsed,
          ...parseDirectiveArguments(spreadNode.directives, getName(spreadNode)!, getKind(spreadNode), options),
        ];
      }

      return parsed;
    }, []);
  }

  return parsedDirectives;
};

export const getInlineFragmentDirectives = (field: InlineFragmentNode, options?: RequestOptions) => {
  return field.directives?.length
    ? parseDirectiveArguments(field.directives, getName(getTypeCondition(field)!)!, getKind(field), options)
    : [];
};

export const parseDirectiveArguments = (
  directives: readonly DirectiveNode[],
  name: string,
  kind: string,
  options?: RequestOptions
) => {
  return directives.reduce<ParsedDirective[]>((parsedDirectives, directive) => {
    let args: PlainObject = {};

    if (directive.arguments && directive.arguments.length > 0) {
      args = getArguments(directive, options) ?? {};
    }

    parsedDirectives.push({
      args,
      name: directive.name.value,
      parentKind: kind,
      parentName: name,
    });

    return parsedDirectives;
  }, []);
};
