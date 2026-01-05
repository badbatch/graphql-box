import { type FieldNode, type InlineFragmentNode, Kind } from 'graphql';

export const addFieldNode = (node: FieldNode | InlineFragmentNode, fieldName: string): void => {
  if (node.selectionSet?.selections.some(s => s.kind === Kind.FIELD && s.name.value === fieldName)) {
    return;
  }

  // @ts-expect-error does not cause a runtime exception
  node.selectionSet ??= {
    kind: Kind.SELECTION_SET,
    selections: [],
  };

  // @ts-expect-error ts not narrowing type correctly
  node.selectionSet.selections = [
    // @ts-expect-error ts not narrowing type correctly
    ...node.selectionSet.selections,
    {
      kind: Kind.FIELD,
      name: { kind: Kind.NAME, value: fieldName },
    },
  ];
};
