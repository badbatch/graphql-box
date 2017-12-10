import {
  FieldNode,
  ListValueNode,
  ObjectValueNode,
  ValueNode,
} from "graphql";

import { ScalarValueNode } from "../types";
import { ObjectMap } from "../../../types";

type ParseValueResult = string | boolean | null | ObjectMap | any[];

function parseValue(valueNode: ValueNode): ParseValueResult {
  let output: ParseValueResult;

  if (valueNode.hasOwnProperty("value")) {
    const scalarValueNode = valueNode as ScalarValueNode;
    output = scalarValueNode.value;
  } else if (valueNode.kind === "ObjectValue") {
    const objectValueNode = valueNode as ObjectValueNode;
    const obj: ObjectMap = {};

    objectValueNode.fields.forEach(({ name, value }) => {
      obj[name.value] = parseValue(value);
    });

    output = obj;
  } else if (valueNode.kind === "ListValue") {
    const listValueNode = valueNode as ListValueNode;
    const arr: any[] = [];

    listValueNode.values.forEach((value) => {
      arr.push(parseValue(value));
    });

    output = arr;
  } else {
    output = null;
  }

  return output;
}

export function getArguments(field: FieldNode): ObjectMap | undefined {
  if (!field.arguments || field.arguments.length) return undefined;
  const args: ObjectMap = {};

  field.arguments.forEach(({ name, value }) => {
    args[name.value] = parseValue(value);
  });

  return args;
}
