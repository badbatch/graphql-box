import { TYPE_NAME_KEY } from "@graphql-box/core";
import { deleteChildFields, getChildFields, getName } from "@graphql-box/helpers";
import { FieldNode, FragmentDefinitionNode, OperationDefinitionNode } from "graphql";
import { CacheManagerContext } from "../defs";

export default (
  field: FieldNode | FragmentDefinitionNode | OperationDefinitionNode,
  { fragmentDefinitions, typeIDKey }: CacheManagerContext,
) => {
  const fieldsAndTypeNames = getChildFields(field, { fragmentDefinitions });

  if (!fieldsAndTypeNames || fieldsAndTypeNames.length > 3) {
    return false;
  }

  const fieldNames = fieldsAndTypeNames.map(({ fieldNode }) => getName(fieldNode) as FieldNode["name"]["value"]);

  if (fieldNames.length === 2 && fieldNames.every(name => name === typeIDKey || name === TYPE_NAME_KEY)) {
    deleteChildFields(
      field,
      fieldsAndTypeNames.map(({ fieldNode }) => fieldNode),
    );

    return true;
  }

  if ((fieldNames.length === 1 && fieldNames[0] === typeIDKey) || fieldNames[0] === TYPE_NAME_KEY) {
    const { fieldNode } = fieldsAndTypeNames[0];
    deleteChildFields(field, fieldNode);
    return true;
  }

  return false;
};
