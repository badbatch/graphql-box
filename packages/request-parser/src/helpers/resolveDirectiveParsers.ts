import { type PlainObject } from '@graphql-box/core';
import { type DirectiveNode, type FieldNode, type FragmentSpreadNode } from 'graphql';
import { type Jsonifiable } from 'type-fest';
import { type DirectiveParser } from '#types.ts';

export const resolveDirectiveParsers = (
  node: FieldNode | FragmentSpreadNode,
  directives: readonly DirectiveNode[],
  directiveParsers: Record<string, DirectiveParser>,
  variables: PlainObject<Jsonifiable>,
  // Return type needs to match the GraphQL return type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  for (const directive of directives) {
    const name = directive.name.value;
    const directiveParser = directiveParsers[name];

    if (!directiveParser) {
      continue;
    }

    const directiveVariables: Record<string, Jsonifiable> = {};

    for (const argumentNode of directive.arguments ?? []) {
      const argumentName = argumentNode.name.value;
      const argumentValue = variables[argumentName];

      if (argumentValue === undefined) {
        throw new Error(`Could not find matching argument value for argument name "${argumentName}".`);
      }

      directiveVariables[argumentName] = argumentValue;
    }

    // Return type needs to match the GraphQL return type.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = directiveParser(node, directive, directiveVariables);

    if (result !== undefined) {
      return result;
    }
  }
};
