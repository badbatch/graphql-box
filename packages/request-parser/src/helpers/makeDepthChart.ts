import { ASTNode } from "graphql";
import getFieldsFromAncestors from "./getFieldsFromAncestors";
import getRequestPathFromAncestors from "./getRequestPathFromAncestors";

export default (ancestorsList: ASTNode[][]) => {
  return ancestorsList.reduce((acc: Record<string, number>, ancestors) => {
    const requestPath = getRequestPathFromAncestors(ancestors);
    const fields = getFieldsFromAncestors(ancestors);
    const depth = fields.length;
    acc[requestPath] = depth;
    return acc;
  }, {});
};
