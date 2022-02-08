import { PlainObjectMap, RequestOptions } from "@graphql-box/core";
import { DirectiveNode, FieldNode, ValueNode, VariableNode } from "graphql";
import { LIST_VALUE, OBJECT_VALUE, VALUE, VARIABLE } from "../../consts";
import { ScalarValueNode } from "../../defs";
import { getKind } from "../kind";
import { getName } from "../name";

type ParseValueResult = string | boolean | null | PlainObjectMap | any[];

function parseValue(valueNode: ValueNode): ParseValueResult {
  let output: ParseValueResult;

  if (valueNode.hasOwnProperty(VALUE)) {
    const scalarValueNode = valueNode as ScalarValueNode;
    output = scalarValueNode.value;
  } else if (valueNode.kind === OBJECT_VALUE) {
    const objectValueNode = valueNode;
    const obj: PlainObjectMap = {};

    objectValueNode.fields.forEach(({ name, value }) => {
      obj[name.value] = parseValue(value);
    });

    output = obj;
  } else if (valueNode.kind === LIST_VALUE) {
    const listValueNode = valueNode;
    const arr: any[] = [];

    listValueNode.values.forEach(value => {
      arr.push(parseValue(value));
    });

    output = arr;
  } else {
    output = null;
  }

  return output;
}

export function getArguments(field: FieldNode | DirectiveNode, options?: RequestOptions): PlainObjectMap | undefined {
  if (!field.arguments || !field.arguments.length) return undefined;
  const args: PlainObjectMap = {};

  field.arguments.forEach(({ name, value }) => {
    if (getKind(value) === VARIABLE && options?.variables) {
      const variableName = getName(value) as VariableNode["name"]["value"];
      const variableValue = options.variables[variableName];
      args[name.value] = variableValue;
    } else {
      args[name.value] = parseValue(value);
    }
  });

  return args;
}
