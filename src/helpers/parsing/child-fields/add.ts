import { FieldNode } from "graphql";
import { isArray } from "lodash";
import { ParentNode } from "../types";

export default function addChildFields(node: ParentNode, fields: FieldNode[] | FieldNode): void {
  if (!node.selectionSet) return;
  let selections = node.selectionSet.selections;

  if (isArray(fields)) {
    selections = [...selections, ...fields];
  } else {
    selections.push(fields);
  }
}
