import { type NamedTypeNode, type TypeNode, type VariableDefinitionNode } from 'graphql';
import { isBoolean } from 'lodash-es';
import { type Jsonifiable } from 'type-fest';
import { TYPE } from '../constants.ts';
import { getName } from './name.ts';

const variableDefinitionTypeVisitor = (node: TypeNode): NamedTypeNode => {
  if (TYPE in node) {
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
    return JSON.parse(value) as Jsonifiable;
  } catch {
    return value;
  }
};

export const getVariableDefinitionType = ({ type }: VariableDefinitionNode): string => {
  return getName(variableDefinitionTypeVisitor(type))!;
};
