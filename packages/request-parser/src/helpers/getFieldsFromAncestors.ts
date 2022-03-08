import { isKind } from "@graphql-box/helpers";
import { ASTNode, FieldNode } from "graphql";

export default (ancestors: ASTNode[]) => {
  return ancestors.reduce((fields: FieldNode[], ancestor) => {
    if (isKind<FieldNode>(ancestor, "Field")) {
      fields.push(ancestor);
    }

    return fields;
  }, []);
};
