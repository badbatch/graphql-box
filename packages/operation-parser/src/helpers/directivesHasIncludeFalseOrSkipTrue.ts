import { isKind } from '@graphql-box/helpers';
import { type BooleanValueNode, type FieldNode, Kind } from 'graphql';

export const directivesHasIncludeFalseOrSkipTrue = (node: FieldNode): boolean => {
  let includeFalseOrSkipTrue = false;

  for (const directive of node.directives ?? []) {
    if (directive.name.value === 'include') {
      const argumentsNode = directive.arguments?.[0];

      if (argumentsNode && isKind<BooleanValueNode>(argumentsNode.value, Kind.BOOLEAN) && !argumentsNode.value.value) {
        includeFalseOrSkipTrue = true;
      }
    } else if (directive.name.value === 'skip') {
      const argumentsNode = directive.arguments?.[0];

      if (argumentsNode && isKind<BooleanValueNode>(argumentsNode.value, Kind.BOOLEAN) && argumentsNode.value.value) {
        includeFalseOrSkipTrue = true;
      }
    }
  }

  return includeFalseOrSkipTrue;
};
