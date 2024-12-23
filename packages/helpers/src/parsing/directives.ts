import { type PlainObject, type RequestOptions } from '@graphql-box/core';
import {
  type DirectiveNode,
  type FieldNode,
  type FragmentDefinitionNode,
  type InlineFragmentNode,
  Kind,
} from 'graphql';
import { getName } from '#parsing/name.ts';
import { type ParsedDirective } from '../types.ts';
import { getArguments } from './arguments.ts';
import { getFragmentSpreads } from './fragmentSpreads.ts';
import { getKind, isKind } from './kind.ts';

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
    ? parseDirectiveArguments(field.directives, field.name.value, getKind(field), options)
    : [];
};

export const getFragmentSpreadDirectives = (
  field: FieldNode | InlineFragmentNode | FragmentDefinitionNode,
  options?: RequestOptions,
) => {
  const fragmentSpreads = getFragmentSpreads(field);
  let parsedDirectives: ParsedDirective[] = [];

  if (fragmentSpreads.length > 0) {
    parsedDirectives = fragmentSpreads.reduce<ParsedDirective[]>((parsed, spreadNode) => {
      const spreadName = getName(spreadNode);

      if (spreadNode.directives && spreadName) {
        return [...parsed, ...parseDirectiveArguments(spreadNode.directives, getKind(spreadNode), spreadName, options)];
      }

      return parsed;
    }, []);
  }

  return parsedDirectives;
};

export const getInlineFragmentDirectives = (field: InlineFragmentNode, options?: RequestOptions) => {
  return field.directives?.length
    ? // Based on context, field is always going to have typeCondition
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parseDirectiveArguments(field.directives, getKind(field), field.typeCondition!.name.value, options)
    : [];
};

export const parseDirectiveArguments = (
  directives: readonly DirectiveNode[],
  kind: string,
  name: string,
  options?: RequestOptions,
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
