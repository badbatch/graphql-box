import { type PlainObject } from '@graphql-box/core';
import { isKind } from '@graphql-box/helpers';
import {
  type BooleanValueNode,
  type FieldNode,
  type FragmentSpreadNode,
  type InlineFragmentNode,
  Kind,
  type VariableNode,
} from 'graphql';

export const directivesHasIncludeFalseOrSkipTrue = (
  node: FieldNode | InlineFragmentNode | FragmentSpreadNode,
  variableValues: PlainObject<unknown>,
): boolean => {
  for (const directive of node.directives ?? []) {
    if (directive.name.value !== 'include' && directive.name.value !== 'skip') {
      continue;
    }

    const ifArgNode = directive.arguments?.find(arg => arg.name.value === 'if');

    if (!ifArgNode) {
      throw new Error(`Directive ${directive.name.value} is missing "if" argument`);
    }

    let ifValue: boolean;

    if (isKind<BooleanValueNode>(ifArgNode.value, Kind.BOOLEAN)) {
      ifValue = ifArgNode.value.value;
    } else if (isKind<VariableNode>(ifArgNode.value, Kind.VARIABLE)) {
      const value = variableValues[ifArgNode.value.name.value];

      if (typeof value !== 'boolean') {
        throw new TypeError(`Directive ${directive.name.value} "if" variable value must be a boolean`);
      }

      ifValue = value;
    } else {
      throw new Error(`Directive ${directive.name.value} "if" argument must be a boolean or variable`);
    }

    if (directive.name.value === 'include' && !ifValue) {
      return true;
    }

    if (directive.name.value === 'skip' && ifValue) {
      return true;
    }
  }

  return false;
};
