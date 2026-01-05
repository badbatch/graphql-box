import { isKind } from '@graphql-box/helpers';
import { type FieldNode, type InlineFragmentNode, Kind, type SelectionNode } from 'graphql';

export const sortSelections = (selections: readonly SelectionNode[]): readonly SelectionNode[] =>
  selections.toSorted((nodeA, nodeB) => {
    if (isKind<FieldNode>(nodeA, Kind.FIELD) && isKind<FieldNode>(nodeB, Kind.FIELD)) {
      if (nodeA.name.value < nodeB.name.value) {
        return -1;
      }

      if (nodeA.name.value > nodeB.name.value) {
        return 1;
      }
    }

    if (
      isKind<InlineFragmentNode>(nodeA, Kind.INLINE_FRAGMENT) &&
      isKind<InlineFragmentNode>(nodeB, Kind.INLINE_FRAGMENT)
    ) {
      if (!nodeA.typeCondition && nodeB.typeCondition) {
        return -1;
      }

      if (nodeA.typeCondition && !nodeB.typeCondition) {
        return 1;
      }

      if (nodeA.typeCondition && nodeB.typeCondition) {
        if (nodeA.typeCondition.name.value < nodeB.typeCondition.name.value) {
          return -1;
        }

        if (nodeA.typeCondition.name.value > nodeB.typeCondition.name.value) {
          return 1;
        }
      }
    }

    if (isKind<FieldNode>(nodeA, Kind.FIELD) && isKind<InlineFragmentNode>(nodeB, Kind.INLINE_FRAGMENT)) {
      return -1;
    }

    if (isKind<InlineFragmentNode>(nodeA, Kind.INLINE_FRAGMENT) && isKind<FieldNode>(nodeB, Kind.FIELD)) {
      return 1;
    }

    return (nodeA.loc?.start ?? 0) - (nodeB.loc?.start ?? 0);
  });
