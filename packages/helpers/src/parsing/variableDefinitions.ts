import { type NamedTypeNode, type TypeNode, type VariableDefinitionNode } from 'graphql';
import { isBoolean } from 'lodash-es';
import { type Jsonifiable } from 'type-fest';

const variableDefinitionTypeVisitor = (node: TypeNode): NamedTypeNode => {
  if ('type' in node) {
    return variableDefinitionTypeVisitor(node.type);
  }

  return node;
};

export const getVariableDefinitionDefaultValue = ({ defaultValue }: VariableDefinitionNode) => {
  if (!defaultValue) {
    return;
  }

  if (!('value' in defaultValue)) {
    return;
  }

  const { value } = defaultValue;

  if (isBoolean(value)) {
    return value;
  }

  try {
    // JSON.parse returns any type
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return JSON.parse(value) as Jsonifiable;
  } catch {
    return value;
  }
};

export const getVariableDefinitionType = ({ type }: VariableDefinitionNode): string =>
  variableDefinitionTypeVisitor(type).name.value;
