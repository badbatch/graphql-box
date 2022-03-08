import { getName, isKind } from "@graphql-box/helpers";
import { ASTNode, FieldNode } from "graphql";

export default (ancestors: ASTNode[]) => {
  return ancestors
    .reduce((path: string[], ancestor) => {
      if (isKind<FieldNode>(ancestor, "Field")) {
        path.push(getName(ancestor) as FieldNode["name"]["value"]);
      }

      return path;
    }, [])
    .join(".");
};
